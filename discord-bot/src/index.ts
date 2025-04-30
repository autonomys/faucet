import { balance, transfer } from '@autonomys/auto-consensus'
import {
  activateWallet,
  ActivateWalletParams,
  address,
  ApiPromise,
  isAddress as isSubspaceAddress,
  NetworkId,
} from '@autonomys/auto-utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CommandInteractionOption, REST, Routes } from 'discord.js'
import { BigNumber, utils } from 'ethers'
import nacl from 'tweetnacl'
import { CommandNames, config, faucetBalanceLowSlackMessage, formatSeconds, log, queries, requestTokens } from './utils'

const sendLowBalanceWarning = async (faucetBalance: BigNumber) =>
  await faucetBalanceLowSlackMessage(utils.formatEther(faucetBalance))

const tagUser = (userId: string) => '<@' + userId + '>'

const buildDiscordInteractionResponse = (content: string, originalInteraction: any) =>
  JSON.stringify({
    type: 4,
    data: {
      content,
      message_reference: {
        message_id: originalInteraction.channel.last_message_id,
        channel_id: originalInteraction.channel.id,
        guild_id: originalInteraction.guild.id,
      },
    },
  })

const buildDiscordMessage = (content: any, originalInteraction?: object) => {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: !originalInteraction
      ? JSON.stringify({ content })
      : buildDiscordInteractionResponse(content, originalInteraction),
    appendToFormData: true,
    passThroughBody: true,
  }
}

const postDiscordMessage = async (rest: REST, channelId: string, message: any, originalInteraction?: any) =>
  await rest.post(
    originalInteraction
      ? Routes.interactionCallback(originalInteraction.id, originalInteraction.token)
      : Routes.channelMessages(channelId),
    buildDiscordMessage(message, originalInteraction),
  )

const finishInteraction = () => {
  return {
    statusCode: 200,
    body: JSON.stringify('Message received'),
  }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const ed25519 = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']
  console.log('body', event.body)
  const rest = new REST({ version: '10' }).setToken(config.TOKEN)

  if (timestamp && ed25519 && event.body) {
    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + event.body),
      Buffer.from(ed25519, 'hex'),
      Buffer.from(config.PUBLIC_KEY, 'hex'),
    )

    if (!isVerified)
      return {
        statusCode: 401,
        body: JSON.stringify('invalid request signature'),
      }

    // Pass the discord interaction endpoint verification
    const body = JSON.parse(event.body)
    if (body.type === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 1 }),
      }
    }

    // Handle commands interactions
    if (body.data.name != null)
      try {
        const interaction = body.data as CommandInteractionOption
        if (interaction.name === CommandNames.REQUEST_TOKENS) {
          log('\x1b[33m%s\x1b[0m', CommandNames.REQUEST_TOKENS, '\x1b[0m')
          await postDiscordMessage(rest, body.channel_id, ':hourglass: Please wait while we process your request', body)

          if (interaction.options != null) {
            const addressOption = interaction.options.find(
              (option: CommandInteractionOption) => option.name === 'address',
            )
            if (addressOption == null || !addressOption.value || typeof addressOption.value !== 'string') {
              await postDiscordMessage(
                rest,
                body.channel_id,
                `:warning: ${tagUser(body.member.user.id)} Please provide an address`,
              )
              return finishInteraction()
            } else if (!utils.isAddress(addressOption.value)) {
              if (isSubspaceAddress(addressOption.value)) {
                const {
                  api,
                  accounts: [wallet],
                } = await activateWallet({
                  uri: process.env.WALLET_CONSENSUS_URI,
                  networkId: NetworkId.TAURUS,
                } as ActivateWalletParams)

                const { free } = await balance(api as unknown as ApiPromise, wallet.address)
                if (
                  BigInt(free) <
                  BigInt(
                    (Number(process.env.SLACK_BALANCE_NOTIFICATION_THRESHOLD) * Number(process.env.CONSENSUS_AMOUNT)) /
                      100,
                  )
                )
                  await sendLowBalanceWarning(BigNumber.from(free.toString()))

                if (BigInt(free) <= BigInt(process.env.CONSENSUS_AMOUNT || '0')) {
                  await postDiscordMessage(
                    rest,
                    body.channel_id,
                    `:warning: ${tagUser(body.member.user.id)} Consensus Faucet balance is too low, please wait for refill`,
                  )
                  return finishInteraction()
                }

                if (!process.env.CONSENSUS_AMOUNT) throw new Error('Missing CONSENSUS_AMOUNT')
                // Create and sign the transfer transaction
                const tx = await transfer(
                  api as unknown as ApiPromise,
                  addressOption.value,
                  process.env.CONSENSUS_AMOUNT,
                )
                const txResponse = await tx.signAndSend(wallet)

                await api.disconnect()
              } else
                await postDiscordMessage(
                  rest,
                  body.channel_id,
                  `:warning: ${tagUser(body.member.user.id)} Please provide a valid EVM address`,
                )
              return finishInteraction()
            } else {
              const currentTime = BigNumber.from(Math.floor(Date.now() / 1000))
              const nextAccessTime = await queries.nextAccessTime(addressOption.value)

              // if nextAccessTime is bigger than currentTime, then the user has to wait
              if (currentTime.gte(nextAccessTime)) {
                const withdrawalAmount = await queries.withdrawalAmount()
                const faucetBalance = await queries.verifyFaucetBalance()

                // if faucetBalance is lower than withdrawalAmount * SLACK_BALANCE_NOTIFICATION_THRESHOLD, then send a slack message
                if (faucetBalance.lt(withdrawalAmount.mul(BigNumber.from(config.SLACK_BALANCE_NOTIFICATION_THRESHOLD))))
                  await sendLowBalanceWarning(faucetBalance)

                // if faucetBalance is lower than withdrawalAmount, then the faucet needs to be refilled
                if (faucetBalance.lt(withdrawalAmount)) {
                  await postDiscordMessage(
                    rest,
                    body.channel_id,
                    `:warning: Faucet balance is too low, please wait for refill`,
                  )
                  return finishInteraction()
                }

                const formattedAmount = utils.formatEther(withdrawalAmount)
                log('withdrawalAmount', formattedAmount)

                // request tokens
                const tx = await requestTokens(addressOption.value)
                log('tx', tx)
                if (tx && tx.hash) {
                  log('tx.hash', tx.hash)
                  await postDiscordMessage(
                    rest,
                    body.channel_id,
                    `${tagUser(body.member.user.id)} We just sent you ${formattedAmount} ${
                      config.TOKEN_SYMBOL
                    } :white_check_mark: tokens\nFind the transaction at ${config.EXPLORER_URL}/tx/${tx.hash}`,
                  )
                  return finishInteraction()
                }
              } else {
                const timeToWait = nextAccessTime.sub(currentTime)
                const formattedTime = timeToWait.toNumber()
                log('nextAccessTime', formattedTime)
                await postDiscordMessage(
                  rest,
                  body.channel_id,
                  `:clock1: ${tagUser(body.member.user.id)} Please wait ${formatSeconds(
                    formattedTime,
                  )} before requesting again`,
                )
                return finishInteraction()
              }
            }
          }
        }
        await postDiscordMessage(
          rest,
          body.channel_id,
          `:warning: ${tagUser(body.member.user.id)} There was an error with your request, please try again.`,
        )
      } catch (error) {
        console.log('error', error)
        await postDiscordMessage(
          rest,
          body.channel_id,
          `:warning: ${tagUser(body.member.user.id)} There was an error with the faucet, please try again later.`,
        )
      }
  }

  return {
    statusCode: 200,
    body: JSON.stringify('Message received'),
  }
}

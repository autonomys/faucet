import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CommandInteractionOption, REST, Routes } from 'discord.js'
import { BigNumber, utils } from 'ethers'
import nacl from 'tweetnacl'
import {
  CommandNames,
  buildSlackStatsMessage,
  config,
  createStats,
  faucetBalanceLowSlackMessage,
  findRequest,
  findStats,
  log,
  queries,
  requestTokens,
  saveRequest,
  sendSlackMessage,
  updateStats,
} from './utils'

const incrementFaucetRequestsCount = async (address: string, requestDate: string) => {
  const stats = await findStats(requestDate)
  log('stats', stats)
  if (!stats || stats === null || stats.length === 0) {
    const slackMessageId = await sendSlackMessage(
      'Current week evm-faucet requests',
      buildSlackStatsMessage('update', 1, 1),
    )
    await createStats(address, slackMessageId, requestDate)
  } else {
    const statsFound = stats[0].data
    const isExistingAddresses = statsFound.addresses.find((a: string) => a === address)
    await sendSlackMessage(
      'Current week evm-faucet requests',
      buildSlackStatsMessage(
        'update',
        statsFound.requests + 1,
        isExistingAddresses ? statsFound.uniqueAddresses : statsFound.uniqueAddresses + 1,
        statsFound.requestsByType,
      ),
      statsFound.slackMessageId,
    )
    await updateStats(stats[0].ref, statsFound, address)
  }
}

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
  const CURRENT_TIME = new Date()
  // Keeping only the date and minutes to avoid spamming the faucet (reduce the number of digit to reduce time between requests)
  const REQUEST_DATE = CURRENT_TIME.toISOString().slice(0, 10) // Daily precision
  const STATS_DATE = CURRENT_TIME.toISOString().slice(0, 10) // Daily precision

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
              await postDiscordMessage(
                rest,
                body.channel_id,
                `:warning: ${tagUser(body.member.user.id)} Please provide an valid EVM address`,
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

                const previousRequestFound = await findRequest(body.member.user.id, REQUEST_DATE)
                if (!previousRequestFound) {
                  // request tokens
                  const tx = await requestTokens(addressOption.value)
                  if (tx && tx.hash) {
                    log('tx.hash', tx.hash)
                    await saveRequest(addressOption.value, body.member.user.id, REQUEST_DATE, tx.hash)
                    await incrementFaucetRequestsCount(addressOption.value, STATS_DATE)
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
                  await postDiscordMessage(
                    rest,
                    body.channel_id,
                    `We already sent you tokens recently, please wait a bit more`,
                  )
                  return finishInteraction()
                }
              } else {
                const timeToWait = nextAccessTime.sub(currentTime)
                const formattedTime = timeToWait.toString()
                log('nextAccessTime', formattedTime)
                await postDiscordMessage(
                  rest,
                  body.channel_id,
                  `:clock1: ${tagUser(
                    body.member.user.id,
                  )} Please wait ${formattedTime} seconds before requesting again`,
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

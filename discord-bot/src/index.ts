import { Client, IntentsBitField } from 'discord.js'
import {
  config,
  CommandNames,
  transactions,
  queries,
  log,
  sendSlackMessage,
  buildSlackStatsMessage,
  faucetBalanceLowSlackMessage,
} from './utils'
import { utils, BigNumber } from 'ethers'

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

let faucetRequestsCount = 0
let slackMessageId: string | undefined = undefined
let lastLowWarningMessage: Date | undefined = undefined

const incrementFaucetRequestsCount = async () => {
  faucetRequestsCount++
  // If it's Monday and there was requests, send a new slack message with the stats from last week and reset the counter
  // If it's not Monday, update the slack message with the new stats
  if (new Date().getDay() === 1 && faucetRequestsCount > 0) {
    slackMessageId = undefined
    slackMessageId = await sendSlackMessage(
      'Last week evm-faucet requests',
      buildSlackStatsMessage('weekRecap', faucetRequestsCount),
    )
    faucetRequestsCount = 0
  } else {
    slackMessageId = await sendSlackMessage(
      'Last week evm-faucet requests',
      buildSlackStatsMessage('update', faucetRequestsCount),
      slackMessageId,
    )
  }
}

// Only send a slack message if the last one was sent more than 1 hour ago
const sendLowBalanceWarning = async (faucetBalance: BigNumber) => {
  if (lastLowWarningMessage === undefined || new Date().getTime() - lastLowWarningMessage.getTime() > 60 * 60 * 1000) {
    lastLowWarningMessage = new Date()
    await faucetBalanceLowSlackMessage(utils.formatEther(faucetBalance))
  }
}

//listens when bot is ready
client.on('ready', (c) => {
  log(`${c.user.tag} is online.`)
})

client.on('messageCreate', (message) => {
  //check if person is bot, if yes do nothing
  if (message.author.bot) return
})

//listen to interactions/event listener
client.on('interactionCreate', async (interaction) => {
  const member = interaction.member

  if (!interaction.isChatInputCommand()) return

  try {
    if (interaction != null)
      switch (interaction.commandName) {
        case CommandNames.REQUEST_TOKENS: {
          await interaction.deferReply()
          log('\x1b[33m%s\x1b[0m', CommandNames.REQUEST_TOKENS, '\x1b[0m')
          const addressOption = interaction.options.get('address')
          if (addressOption === null || !addressOption.value || typeof addressOption.value !== 'string') {
            interaction.followUp('Please provide an address')
            return
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
                interaction.followUp('Faucet balance is too low, please wait for refill')
                return
              }
              const formattedAmount = utils.formatEther(withdrawalAmount)
              log('withdrawalAmount', formattedAmount)

              // request tokens
              const tx = await transactions.requestTokens(addressOption.value)
              if (tx && tx.hash) {
                interaction.followUp(
                  'We just sent you ' +
                    formattedAmount +
                    ' ' +
                    config.TOKEN_SYMBOL +
                    ' tokens\nFind the transaction at ' +
                    config.EXPLORER_URL +
                    '/tx/' +
                    tx.hash,
                )
                await incrementFaucetRequestsCount()
              } else interaction.followUp('Transaction failed')
            } else {
              const timeToWait = nextAccessTime.sub(currentTime)
              const formattedTime = timeToWait.toString()
              log('nextAccessTime', formattedTime)
              interaction.followUp('Please wait ' + formattedTime + ' seconds before requesting again')
            }
          }
          break
        }
      }
  } catch (error: any) {
    log('error', error)
    interaction.followUp(`There was an error with the faucet, please try again later.`)
  }
})

client.login(process.env.TOKEN)

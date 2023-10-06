import { TBlocks, slackBuilder, slackUtils } from 'slack-utility'

export const sendSlackMessage = async (message: string, blocks: TBlocks, messageIdToEdit?: string) => {
  if (process.env.SLACK_ENABLED) {
    try {
      if (messageIdToEdit) {
        const slackMsg = await slackUtils.slackUpdateMessage(
          process.env.SLACK_TOKEN || '',
          process.env.SLACK_CONVERSATION_ID || '',
          message,
          messageIdToEdit,
          blocks,
          false,
          false,
          false
        )
        return slackMsg.ts ?? undefined
      } else {
        const slackMsg = await slackUtils.slackPostMessage(
          process.env.SLACK_TOKEN || '',
          process.env.SLACK_CONVERSATION_ID || '',
          message,
          blocks,
          false,
          false,
          false
        )
        return slackMsg.resultPostMessage.ts ?? undefined
      }
    } catch (e) {
      console.error('Error sending slack message', e)
    }
  }
}

export const buildSlackStatsMessage = (
  type: 'weekRecap' | 'update',
  requestCount: number,
  uniqueAddresses: number,
  requestsByType?: {
    [key: string]: number
  }
): TBlocks => {
  const blocks = [slackBuilder.buildSimpleSlackHeaderMsg('Faucet stats')]
  switch (type) {
    case 'weekRecap':
      blocks.push(
        slackBuilder.buildSimpleSectionMsg(`This week total requests: ${requestCount} :subspace-hype:`),
        slackBuilder.buildSimpleSectionMsg(`Unique addresses: ${uniqueAddresses} :subheart-white:`)
      )
      return blocks
    case 'update':
      blocks.push(
        slackBuilder.buildSimpleSectionMsg(
          `Current total requests: ${requestCount} ${requestCount > 100 ? ':subspace-hype:' : ':subheart-black:'}`
        ),
        slackBuilder.buildSimpleSectionMsg(`Unique addresses: ${uniqueAddresses} :subheart-white:`)
      )
      requestsByType &&
        blocks.push(
          slackBuilder.buildSimpleSectionMsg(
            'Requests by type:',
            `\`\`\`${JSON.stringify(requestsByType, null, 2)}\`\`\``
          )
        )
      return blocks
  }
}

export const faucetBalanceLowSlackMessage = async (balance: string) => {
  const blocks = [
    slackBuilder.buildSimpleSlackHeaderMsg('Faucet balance is low'),
    slackBuilder.buildSimpleSectionMsg(
      `The faucet balance is ${balance} ${process.env.TOKEN_SYMBOL}, please refill the faucet.`
    )
  ]
  await sendSlackMessage('Faucet balance low', blocks)
}

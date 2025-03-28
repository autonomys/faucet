interface SlackBlock {
  type: string
  text: {
    type: string
    text: string
  }
}

interface RequestsByType {
  [key: string]: number
}

interface SlackPayload {
  channel: string
  text: string
  blocks: SlackBlock[]
  ts?: string
}

export const sendSlackMessage = async (
  message: string,
  blocks: SlackBlock[],
  messageIdToEdit?: string
): Promise<string | undefined> => {
  if (process.env.SLACK_ENABLED) {
    const token = process.env.SLACK_TOKEN || ''
    const conversationId = process.env.SLACK_CONVERSATION_ID || ''
    const url = messageIdToEdit ? 'https://slack.com/api/chat.update' : 'https://slack.com/api/chat.postMessage'

    const payload: SlackPayload = {
      channel: conversationId,
      text: message,
      blocks: blocks
    }

    if (messageIdToEdit) {
      payload.ts = messageIdToEdit
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!data.ok) {
        throw new Error(data.error)
      }

      return data.ts || undefined
    } catch (e) {
      console.error('Error sending slack message', e)
    }
  }
}

export const sendSlackStatsMessage = async (requestCount: number, messageIdToEdit?: string) => {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Claim stats'
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Total requests: ${requestCount} :autonomys: `
      }
    }
  ]
  return await sendSlackMessage('Wallet balance low', blocks, messageIdToEdit)
}

export const buildSlackStatsMessage = (
  type: 'weekRecap' | 'update',
  requestCount: number,
  uniqueAddresses: number,
  requestsByType?: RequestsByType
): SlackBlock[] => {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Faucet stats'
      }
    }
  ]

  switch (type) {
    case 'weekRecap':
      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `This week total requests: ${requestCount} :autonomys:`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Unique addresses: ${uniqueAddresses} :auto-heart:`
          }
        }
      )
      break

    case 'update':
      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Current total requests: ${requestCount} ${requestCount > 100 ? ':autonomys:' : ':auto-heart:'}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Unique addresses: ${uniqueAddresses} :auto-heart:`
          }
        }
      )
      if (requestsByType) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Requests by type:\n\`\`\`${JSON.stringify(requestsByType, null, 2)}\`\`\``
          }
        })
      }
      break
  }

  return blocks
}

export const faucetBalanceLowSlackMessage = async (balance: string) => {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Faucet balance is low'
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `The faucet balance is ${balance} ${process.env.TOKEN_SYMBOL}, please refill the faucet.`
      }
    }
  ]
  await sendSlackMessage('Faucet balance low', blocks)
}

export const walletBalanceLowSlackMessage = async (balance: string, wallet: string) => {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Wallet balance is low'
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `The wallet balance has ${balance} ${process.env.TOKEN_SYMBOL}, please refill the wallet. \`${wallet}\``
      }
    }
  ]
  return await sendSlackMessage('Wallet balance low', blocks)
}

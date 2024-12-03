import { config, log } from './config'

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
  messageIdToEdit?: string,
): Promise<string | undefined> => {
  if (config.SLACK_ENABLED) {
    const token = config.SLACK_TOKEN
    const conversationId = config.SLACK_CONVERSATION_ID
    const url = messageIdToEdit ? 'https://slack.com/api/chat.update' : 'https://slack.com/api/chat.postMessage'

    const payload: SlackPayload = {
      channel: conversationId,
      text: message,
      blocks: blocks,
    }

    if (messageIdToEdit) {
      payload.ts = messageIdToEdit
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!data.ok) {
        throw new Error(data.error)
      }

      return data.ts || undefined
    } catch (e) {
      log('Error sending slack message', e)
    }
  }
}

export const buildSlackStatsMessage = (
  type: 'weekRecap' | 'update',
  requestCount: number,
  uniqueAddresses: number,
  requestsByType?: RequestsByType,
): SlackBlock[] => {
  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Faucet stats',
      },
    },
  ]

  switch (type) {
    case 'weekRecap':
      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `This week total requests: ${requestCount} :autonomys:`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Unique addresses: ${uniqueAddresses} :subheart-white:`,
          },
        },
      )
      break

    case 'update':
      blocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Current total requests: ${requestCount} ${
              requestCount > 100 ? ':autonomys:' : ':auto-heart:'
            }`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Unique addresses: ${uniqueAddresses} :auto-heart:`,
          },
        },
      )
      if (requestsByType) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Requests by type:\n\`\`\`${JSON.stringify(
              {
                ...requestsByType,
                discord: requestsByType.discord ? requestsByType.discord + 1 : 1,
              },
              null,
              2,
            )}\`\`\``,
          },
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
        text: 'Faucet balance is low',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `The faucet balance is ${balance} ${config.TOKEN_SYMBOL}, please refill the faucet.`,
      },
    },
  ]
  await sendSlackMessage('Faucet balance low', blocks)
}

import * as dotenv from 'dotenv'

dotenv.config()

const loadEnv = (key: string): string => {
  if (!process.env[key]) throw new Error(`${key} is not defined`)
  return process.env[key] || ''
}

export const config = {
  TOKEN: loadEnv('TOKEN'),
  GUILD_ID: loadEnv('GUILD_ID'),
  CLIENT_ID: loadEnv('CLIENT_ID'),
  CONTRACT_ADDRESS: loadEnv('CONTRACT_ADDRESS'),
  PRIVATE_KEY: loadEnv('PRIVATE_KEY'),
  TOKEN_SYMBOL: loadEnv('TOKEN_SYMBOL'),
  RPC_ENDPOINT: loadEnv('RPC_ENDPOINT'),
  EXPLORER_URL: loadEnv('EXPLORER_URL'),
  DEBUG_MODE: loadEnv('DEBUG_MODE') === 'true',
  SLACK_ENABLED: loadEnv('SLACK_ENABLED') === 'true',
  SLACK_BALANCE_NOTIFICATION_THRESHOLD: loadEnv('SLACK_BALANCE_NOTIFICATION_THRESHOLD'),
  SLACK_TOKEN: loadEnv('SLACK_TOKEN'),
  SLACK_CONVERSATION_ID: loadEnv('SLACK_CONVERSATION_ID'),
}

export const log = (message?: any, ...optionalParams: any[]) =>
  config.DEBUG_MODE && console.log(message, ...optionalParams)

import { ApplicationCommandOptionType } from 'discord.js'

export enum CommandNames {
  REQUEST_TOKENS = 'faucet',
}

export const commands = [
  {
    name: CommandNames.REQUEST_TOKENS,
    description: 'Requests Tokens!',
    options: [
      {
        name: 'address',
        description: 'address',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
]

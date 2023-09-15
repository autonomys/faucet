import { REST, Routes } from 'discord.js'
import { config, commands } from './utils'

//interact with API
const rest = new REST({ version: '10' }).setToken(config.TOKEN)

;(async () => {
  //allows await() to check for errors
  try {
    console.log('Registering slash commands...')

    await rest.put(
      //send Put request to update info
      Routes.applicationGuildCommands(
        //generate URL
        config.CLIENT_ID,
        config.GUILD_ID,
      ),
      { body: commands }, //object payload of put request
    )

    console.log('Slash commands were registered successfully!')
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
})()

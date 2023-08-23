## Setup Instructions:

### 1. **Environment Configuration:**
* Set up the environment file.
* Define `Guild ID`: 
  - Navigate to Activate Developer Mode in Discord.
  - Copy the Server ID.

### 2. **Bot Token:**
* Navigate to Discord Developer Portal.
* Under the bot section, grab the `Token`.
  * _Note_: This token is a one-time use token.

### 3. **Client ID:**
* Right-click the bot in your server.
* Select and copy the `ID` for the Client ID.

### 4. **Dependencies Installation:**
```bash
npm install discord.js ethers nodemon
```

### 5. **Register Commands:**
```bash
node src/register-commands.js
```

### 6. **Run The Project:**
```bash
nodemon src/index.js
```

### 7. **Execute Bot Command:**
* Go to your Discord server.
* Run the command /request_tokens_guild_specific.
* Provide an Ethereum Address when prompted.
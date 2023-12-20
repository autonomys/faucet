# Faucet Web App

[![Netlify Status](https://api.netlify.com/api/v1/badges/53c4ebc2-182b-4b31-820e-9e4fb006f574/deploy-status)](https://app.netlify.com/sites/subspacefaucet/deploys)

This is a next.js web app that is used to interact with the faucet smart contract.
We ask the user to connect using their wallet and a OAuth provider (GitHub or Discord) to protect against spam requests.

## Environment Variables

| Variables                               | Description                                                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | ProjectID use by WalletConnect connector https://cloud.walletconnect.com/                                                     |
| `GITHUB_CLIENT_ID`                      | GitHub App id https://github.com/settings/apps                                                                                |
| `GITHUB_CLIENT_SECRET`                  | GitHub App Secret                                                                                                             |
| `GITHUB_ACCOUNT_NAME`                   | Account name on GitHub we will be looking at to make sure the user is following this account before requesting token          |
| `DISCORD_CLIENT_ID`                     | Discord App Id                                                                                                                |
| `DISCORD_CLIENT_SECRET`                 | Discord App Secret                                                                                                            |
| `DISCORD_GUILD_ID`                      | Discord Guild Id we will be looking at to make sure the user is already a member of the server before requesting token        |
| `TWITTER_CLIENT_ID`                     | Twitter OAuth 2 Client Id (currently not used)                                                                                |
| `TWITTER_CLIENT_SECRET`                 | Twitter OAuth 2 Client Secret (currently not used)t                                                                           |
| `NEXTAUTH_SECRET`                       | Next-Auth secret to sign/verify the JWT token                                                                                 |
| `NEXTAUTH_URL`                          | Url of the web app                                                                                                            |
| `PRIVATE_KEY`                           | Private key with Minter role on the Faucet smart contract                                                                     |
| `NEXT_PUBLIC_RPC_ENDPOINT`              | RPC endpoint use to request token and as well to add to the user network (metamask) if the user does not has this network yet |
| `SLACK_ENABLED`                         | true/false to enable slack alert and reporting                                                                                |
| `SLACK_BALANCE_NOTIFICATION_THRESHOLD`  | This amount \* the withdraw amount is the threshold                                                                           |
| `SLACK_TOKEN`                           | Slack token                                                                                                                   |
| `SLACK_CONVERSATION_ID`                 | Slack conversation Id message will be sent to                                                                                 |
| `FAUNA_DB_SECRET`                       | Fauna db secret                                                                                                               |

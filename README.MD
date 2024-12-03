# Autonomys Testnet Faucet

## Workspace Setup

- [Faucet Smart Contract](./smart_contract) - The Faucet Smart Contract, tests, deployment scripts and other related files. (HardHat&Foundry)
- [Web App](./web-app) - The Web App, tests, request token with a GitHub&Discord Next-Auth integration. (React&Next.js)
- [Discord Bot](./discord-bot) - The Discord Bot, request token on Discord (Node.js&AWL Lambda)
- [Subgraph](./subgraph) - The Subgraph, faucet smart contract events indexed on Alchemy&The Graph (Alchemy&The Graph)

## Faucet Smart Contract

### Move to the smart contract directory and install dependencies

```bash
cd smart_contract
npm install
```

### Compile the smart contract

```bash
npx hardhat compile
```

### Run tests

```bash
npx hardhat test
```

### Deploy the smart contract

```bash
npx hardhat run scripts/deploy.js --network <networkName>
```

## Web App

### Live Working Web App

[![Netlify Status](https://api.netlify.com/api/v1/badges/53c4ebc2-182b-4b31-820e-9e4fb006f574/deploy-status)](https://app.netlify.com/sites/subspacefaucet/deploys)

- [Autonomys Faucet](https://subspacefaucet.com/)

### Move to the web app directory and install dependencies

```bash
cd web-app
yarn
```

### Run the web app

```bash
yarn dev
```

## Discord Bot

### Move to the discord bot directory and install dependencies

```bash
cd discord-bot
npm install
```

### Register the Discord commands

```bash
npm run register
```

### Deploy the Discord bot

```bash
npm run deploy
```

## Subgraph

### Deployed Subgraph

- [Subgraph on Alchemy for Faucet Contract on Goerli](https://subgraphs.alchemy.com/subgraphs/2634)
- [Subgraph on TheGraph for Faucet Contract on Goerli](https://thegraph.com/studio/subgraph/faucet-goerli/)

### Move to the subgraph directory and install dependencies

```bash
cd subgraph
yarn global add @graphprotocol/graph-cli
yarn
```

### Initialize the subgraph

```bash
graph init --studio faucet-goerli
```

### Deploy the subgraph

```bash
graph auth --studio <studio-access-token>
cd faucet-goerli
graph codegen && graph build
graph deploy --studio faucet-goerli
```

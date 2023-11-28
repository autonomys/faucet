# Subgraph

## Faucet Contract Subgraph

This workspace has 2 subgraphs:

- Faucet Contract on Gemini Nova (using Alchemy)
- Faucet Contract on Goerli (using TheGraph & Alchemy)

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

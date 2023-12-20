# Subgraph

## Faucet Contract on Goerli

Test contract deployed on Goerli to test the subgraph more easily.

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

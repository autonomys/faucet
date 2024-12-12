# Subgraph

## Faucet Contract on Taurus Auto EVM

Faucet contract deployed on Taurus Auto EVM with Alchemy.

### Deployed Subgraph

- [Subgraph on Alchemy for Faucet Contract](https://subgraphs.alchemy.com/subgraphs/2676)

### Move to the subgraph directory and install dependencies

```bash
cd subgraph
yarn global add @graphprotocol/graph-cli
yarn
```

### Deploy the subgraph

```bash
cd faucet-taurus
graph codegen && graph build
graph deploy faucet-taurus --version-label <versionTag> --node https://subgraphs.alchemy.com/api/subgraphs/deploy --deploy-key <deploymentKey> --ipfs https://ipfs.satsuma.xyz
```

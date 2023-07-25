require('dotenv').config()

const hre = require("hardhat");
const private_key = process.env.PRIVATE_KEY

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet2");
  const faucet = await Faucet.deploy("0xFC2Aa4EEC439FbAF8315c4FF9443692d8970579c");

  await faucet.deployed();

  console.log("SubspaceTestToken Faucet2 contract deployed: ", faucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

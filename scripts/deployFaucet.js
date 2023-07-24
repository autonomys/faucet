require('dotenv').config()

const hre = require("hardhat");
const private_key = process.env.PRIVATE_KEY

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy(private_key);

  await faucet.deployed();

  console.log("SubspaceTestToken Faucet contract deployed: ", faucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

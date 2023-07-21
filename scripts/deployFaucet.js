const hre = require("hardhat");

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy("0xFC2Aa4EEC439FbAF8315c4FF9443692d8970579c");

  await faucet.deployed();

  console.log("SubspaceTestToken Faucet contract deployed: ", faucet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

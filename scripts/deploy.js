const hre = require("hardhat");

async function main() {
  const SubspaceTestToken = await hre.ethers.getContractFactory("SubspaceTestToken");
  const subspaceTestToken = await SubspaceTestToken.deploy(100000000, 50);

  await subspaceTestToken.deployed();

  console.log("SubspaceTestToken deployed: ", subspaceTestToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
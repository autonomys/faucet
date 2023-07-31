const hre = require("hardhat");

async function main() {
  const SubspaceTestToken = await hre.ethers.getContractFactory("NonErc20SubspaceTestToken3");
  console.log(SubspaceTestToken)
  const subspaceTestToken = await SubspaceTestToken.deploy(10000);

  await subspaceTestToken.deployed();

  console.log("SubspaceTestToken deployed: ", subspaceTestToken.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
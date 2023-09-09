import { Signer } from 'ethers'
import { addressBook, ethers, network } from 'hardhat'

export const deploy = async (deployer: Signer, logAddress: boolean = true) => {
  const Faucet = await ethers.getContractFactory('Faucet')
  const faucet = await Faucet.deploy()

  await faucet.waitForDeployment()
  const faucetAddress = await faucet.getAddress()
  const deploymentTransaction = faucet.deploymentTransaction()
  if (deploymentTransaction != null) deploymentTransaction.wait(2)

  if (logAddress) {
    addressBook.saveContract(
      'Faucet',
      faucetAddress,
      network.name,
      await deployer.getAddress(),
      network.config.chainId,
      deploymentTransaction?.blockHash != null ? deploymentTransaction?.blockHash : undefined,
      deploymentTransaction?.blockNumber != null ? deploymentTransaction?.blockNumber : undefined,
      'Faucet deployed by deploy script',
      {},
      true,
    )

    console.log('Faucet deployed to:', faucetAddress)
  }

  return { faucet, faucetAddress }
}

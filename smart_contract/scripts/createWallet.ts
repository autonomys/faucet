import { ethers } from 'hardhat'

async function main() {
  const randomWallet = ethers.Wallet.createRandom()

  console.log('randomWallet.address', randomWallet.address)
  console.log('randomWallet.privateKey', randomWallet.privateKey)
  console.log('randomWallet.mnemonic', randomWallet.mnemonic)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

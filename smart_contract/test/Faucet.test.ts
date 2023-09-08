import { time, loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { setup, values, errors } from '../scripts/utils'

describe('Faucet', function () {
  async function deploy() {
    const [deployer] = await ethers.getSigners()
    const deployerAddress = await deployer.getAddress()

    return { ...(await setup(deployer, [deployerAddress], false)), deployer, deployerAddress }
  }

  describe('Deployment', function () {
    it('Should set the deployer as admin role on all contract', async function () {
      const { faucet, deployerAddress } = await loadFixture(deploy)

      expect(await faucet.isAdmin(deployerAddress)).to.be.true
    })

    it('Should set the faucet as faucet role on MockERC20 and MockERC721', async function () {
      const { faucetAddress } = await loadFixture(deploy)
    })

    it('Should set the deployer as minter role on Faucet', async function () {
      const { faucet, deployerAddress } = await loadFixture(deploy)

      expect(await faucet.isMinter(deployerAddress)).to.be.true
    })
  })

  describe('Request tokens', function () {
    it('Minter can dispatch native token to wallet2', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()
      const currentWallet2Balance = await wallet2.provider.getBalance(wallet2Address)

      const { faucet, faucetAddress, deployer } = await loadFixture(deploy)

      const withdrawalAmount = await faucet.withdrawalAmount()
      await deployer.sendTransaction({ to: faucetAddress, value: withdrawalAmount.toString() })

      await faucet.connect(deployer).requestTokens(wallet2Address)

      await expect(await wallet2.provider.getBalance(wallet2Address)).to.be.equal(
        currentWallet2Balance + withdrawalAmount,
      )
    })
  })

  describe('Admin functions', function () {
    it('Faucet admin can change withdrawal amount', async function () {
      const { faucet, deployer } = await loadFixture(deploy)

      const withdrawalAmount = await faucet.withdrawalAmount()
      const newWithdrawalAmount = withdrawalAmount + BigInt(10)

      await faucet.connect(deployer).setWithdrawalAmount(newWithdrawalAmount)

      await expect(await faucet.withdrawalAmount()).to.be.equal(newWithdrawalAmount)
    })

    it('Faucet admin can change lock time', async function () {
      const { faucet, deployer } = await loadFixture(deploy)

      const lockTime = await faucet.lockTime()
      const newLockTime = lockTime + BigInt(10)

      await faucet.connect(deployer).setLockTime(newLockTime)

      await expect(await faucet.lockTime()).to.be.equal(newLockTime)
    })

    it('Faucet admin can withdraw all native token', async function () {
      const { faucet, faucetAddress, deployer, deployerAddress } = await loadFixture(deploy)

      const withdrawalAmount = await faucet.withdrawalAmount()
      await deployer.sendTransaction({ to: faucetAddress, value: withdrawalAmount.toString() })

      const currentDeployerBalance = await deployer.provider.getBalance(deployerAddress)

      await faucet.connect(deployer).withdraw()

      await expect(await deployer.provider.getBalance(deployerAddress)).to.be.greaterThanOrEqual(currentDeployerBalance)
    })

    it('Faucet admin can add new minter', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await faucet.connect(deployer).addMinter(wallet2Address)

      await expect(await faucet.isMinter(wallet2Address)).to.be.true
    })

    it('Faucet admin can remove minter', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await faucet.connect(deployer).addMinter(wallet2Address)

      await expect(await faucet.isMinter(wallet2Address)).to.be.true

      await faucet.connect(deployer).removeMinter(wallet2Address)

      await expect(await faucet.isMinter(wallet2Address)).to.be.false
    })

    it('Faucet admin can add new admin', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await faucet.connect(deployer).addAdmin(wallet2Address)

      await expect(await faucet.isAdmin(wallet2Address)).to.be.true
    })

    it('Faucet admin can remove admin', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await faucet.connect(deployer).addAdmin(wallet2Address)

      await expect(await faucet.isAdmin(wallet2Address)).to.be.true

      await faucet.connect(deployer).removeAdmin(wallet2Address)

      await expect(await faucet.isAdmin(wallet2Address)).to.be.false
    })
  })

  describe('Request tokens by non-minter role', function () {
    it('Non-Minter cannot dispatch native token to wallet2', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()
      const currentWallet2Balance = await wallet2.provider.getBalance(wallet2Address)

      const { faucet, faucetAddress, deployer } = await loadFixture(deploy)

      const withdrawalAmount = await faucet.withdrawalAmount()
      await deployer.sendTransaction({ to: faucetAddress, value: withdrawalAmount.toString() })

      await expect(faucet.connect(wallet2).requestTokens(wallet2Address)).to.be.revertedWith(
        errors.MinterRole.NotMinter,
      )
      await expect(await wallet2.provider.getBalance(wallet2Address)).to.be.lessThanOrEqual(currentWallet2Balance)
    })
  })

  describe('Admin functions call by Non-Admin', function () {
    it('Non-Faucet admin cannot change withdrawal amount', async function () {
      const [, wallet2] = await ethers.getSigners()

      const { faucet } = await loadFixture(deploy)

      const withdrawalAmount = await faucet.withdrawalAmount()
      const newWithdrawalAmount = withdrawalAmount + BigInt(10)

      await expect(faucet.connect(wallet2).setWithdrawalAmount(newWithdrawalAmount)).to.be.revertedWith(
        errors.MinterRole.NotAdmin,
      )

      await expect(await faucet.withdrawalAmount()).to.be.equal(withdrawalAmount)
    })

    it('Non-Faucet admin cannot change lock time', async function () {
      const [, wallet2] = await ethers.getSigners()

      const { faucet } = await loadFixture(deploy)

      const lockTime = await faucet.lockTime()
      const newLockTime = lockTime + BigInt(10)

      await expect(faucet.connect(wallet2).setLockTime(newLockTime)).to.be.revertedWith(errors.MinterRole.NotAdmin)

      await expect(await faucet.lockTime()).to.be.equal(lockTime)
    })

    it('Non-Faucet admin cannot withdraw all native token', async function () {
      const [, wallet2] = await ethers.getSigners()

      const { faucet, faucetAddress, deployer, deployerAddress } = await loadFixture(deploy)

      const withdrawalAmount = await faucet.withdrawalAmount()
      await deployer.sendTransaction({ to: faucetAddress, value: withdrawalAmount.toString() })

      const currentDeployerBalance = await deployer.provider.getBalance(deployerAddress)

      await expect(faucet.connect(wallet2).withdraw()).to.be.revertedWith(errors.MinterRole.NotAdmin)

      await expect(await deployer.provider.getBalance(deployerAddress)).to.be.lessThanOrEqual(currentDeployerBalance)
    })

    it('Non-Faucet admin cannot add new minter', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await expect(faucet.connect(wallet2).addMinter(wallet2Address)).to.be.revertedWith(errors.MinterRole.NotAdmin)

      await expect(await faucet.isMinter(wallet2Address)).to.be.false
    })

    it('Non-Faucet admin cannot remove minter', async function () {
      const [, wallet2, wallet3] = await ethers.getSigners()
      const wallet3Address = await wallet3.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await faucet.connect(deployer).addMinter(wallet3Address)

      await expect(await faucet.isMinter(wallet3Address)).to.be.true

      await expect(faucet.connect(wallet2).removeMinter(wallet3Address)).to.be.revertedWith(errors.MinterRole.NotAdmin)

      await expect(await faucet.isMinter(wallet3Address)).to.be.true
    })

    it('Non-Faucet admin cannot add new admin', async function () {
      const [, wallet2] = await ethers.getSigners()
      const wallet2Address = await wallet2.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await expect(faucet.connect(wallet2).addAdmin(wallet2Address)).to.be.revertedWith(errors.MinterRole.NotAdmin)

      await expect(await faucet.isAdmin(wallet2Address)).to.be.false
    })

    it('Non-Faucet admin cannot remove admin', async function () {
      const [, wallet2, wallet3] = await ethers.getSigners()
      const wallet3Address = await wallet3.getAddress()

      const { faucet, deployer } = await loadFixture(deploy)

      await faucet.connect(deployer).addAdmin(wallet3Address)

      await expect(await faucet.isAdmin(wallet3Address)).to.be.true

      await expect(faucet.connect(wallet2).removeAdmin(wallet3Address)).to.be.revertedWith(errors.MinterRole.NotAdmin)

      await expect(await faucet.isAdmin(wallet3Address)).to.be.true
    })
  })
})

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title Faucet - Test
 */

import { CheatCodes } from 'foundry-test-utility/contracts/utils/cheatcodes.sol';
import { Constants } from "./utils/constants.t.sol";

import { Faucet } from "../Faucet.sol";

contract FaucetTest is Constants {
    Faucet private faucet;

    function setUp() public {
        vm.startPrank(ADMIN);

        // Deploy contracts
        faucet = new Faucet();

        faucet.addMinter(address(this));

        vm.deal(address(faucet), BASIC_MINT_AMOUNT);

        vm.stopPrank();
        vm.warp(1 hours);
    }
    
    function test_Native_mint(
        address to_
    ) public {
        vm.assume(to_ != address(0));
        vm.assume(to_.code.length == 0);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);
    }

    function test_requestTokenBeforeLockTime(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        faucet.requestTokens(to_);

        vm.warp(block.timestamp + 1);
        verify_revertCall(RevertStatus.Faucet_InsufficientTimeElapsed);
        faucet.requestTokens(to_);
    }

    function test_requestTokenAfterBalanceIsEmpty() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);
        vm.warp(block.timestamp + BASIC_TIME_LOCK + 1);
        verify_revertCall(RevertStatus.Faucet_FailSendingNativeToken);
        faucet.requestTokens(to_);

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);
    }

    function test_requestTokens_then_requestToken_onSameBlock() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);
        verify_revertCall(RevertStatus.Faucet_InsufficientTimeElapsed);
        faucet.requestTokens(to_);

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);
    }

    function test_dispatchAllToken_thenFailToWithdrawLeftOver() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);
        verify_revertCall(RevertStatus.Faucet_NoNativeTokenLeft);
        vm.prank(ADMIN);
        faucet.withdraw();

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);
    }

    function test_dispatchAllToken_thenSucceedToWithdrawLeftOver() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);
        vm.deal(address(faucet), BASIC_MINT_AMOUNT);
        vm.prank(ADMIN);
        faucet.withdraw();

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(ADMIN).balance, BASIC_MINT_AMOUNT);
        assertEq(address(faucet).balance, 0);
    }

    function test_Faucet_dispatch_then_setWithdrawalAmount_and_dispatchAgain() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);

        uint256 newWithdrawalAmount = BASIC_MINT_AMOUNT * 2;
        vm.deal(address(faucet), newWithdrawalAmount);
        vm.prank(ADMIN);
        faucet.setWithdrawalAmount(newWithdrawalAmount);

        vm.warp(block.timestamp + BASIC_TIME_LOCK + 1);
        faucet.requestTokens(to_);
        expectedBalance += newWithdrawalAmount;

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);
    }

    function test_Faucet_dispatch_then_setLockTime_and_dispatchAgain() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestTokens(to_);

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);

        uint256 newLockTime = BASIC_TIME_LOCK * 10;
        vm.deal(address(faucet), BASIC_MINT_AMOUNT);
        vm.prank(ADMIN);
        faucet.setLockTime(newLockTime);

        verify_revertCall(RevertStatus.Faucet_InsufficientTimeElapsed);
        vm.warp(block.timestamp + BASIC_TIME_LOCK + 1);
        faucet.requestTokens(to_);

        vm.warp(block.timestamp + newLockTime);
        faucet.requestTokens(to_);
        expectedBalance += BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, expectedBalance);
        assertEq(address(faucet).balance, 0);
    }
}
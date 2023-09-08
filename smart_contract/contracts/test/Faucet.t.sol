// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title Faucet - Test
 */

import { CheatCodes } from 'foundry-test-utility/contracts/utils/cheatcodes.sol';
import { Constants } from "./utils/constants.t.sol";

import { Faucet } from "../Faucet.sol";
import { MockERC20 } from "../mocks/MockERC20.sol";
import { MockERC721 } from "../mocks/MockERC721.sol";

contract FaucetTest is Constants {
    Faucet private faucet;
    MockERC20 private mockERC20;
    MockERC721 private mockERC721;

    function setUp() public {
        vm.startPrank(ADMIN);
        // Deploy contracts
        mockERC20 = new MockERC20();
        mockERC721 = new MockERC721();

        faucet = new Faucet(address(mockERC20), address(mockERC721));

        mockERC20.addFaucet(address(faucet));
        mockERC721.addFaucet(address(faucet));

        faucet.addMinter(address(this));

        vm.deal(address(faucet), BASIC_MINT_AMOUNT);

        vm.stopPrank();
        vm.warp(1 hours);
    }

    function test_MockERC20_name() public {
        assertEq(mockERC20.name(), MockERC20_CONTRACT_NAME);
    }
    function test_MockERC20_symbol() public {
        assertEq(mockERC20.symbol(), MockERC20_CONTRACT_SYMBOL);
    }

    function test_MockERC721_name() public {
        assertEq(mockERC721.name(), MockERC721_CONTRACT_NAME);
    }
    function test_MockERC721_symbol() public {
        assertEq(mockERC721.symbol(), MockERC721_CONTRACT_SYMBOL);
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

    function test_MockERC20_mint(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC20.balanceOf(to_), 0);
        assertEq(mockERC20.totalSupply(), 0);

        faucet.requestERC20Tokens(to_);

        assertEq(mockERC20.balanceOf(to_), BASIC_MINT_AMOUNT);
        assertEq(mockERC20.totalSupply(), BASIC_MINT_AMOUNT);
    }

    function test_MockERC20_burn(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC20.balanceOf(to_), 0);
        assertEq(mockERC20.totalSupply(), 0);

        faucet.requestERC20Tokens(to_);

        assertEq(mockERC20.balanceOf(to_), BASIC_MINT_AMOUNT);

        vm.prank(to_);

        mockERC20.burn(BASIC_MINT_AMOUNT);

        assertEq(mockERC20.balanceOf(to_), 0);
        assertEq(mockERC20.totalSupply(), 0);
    }
    
    function test_MockERC721_mint(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC721.balanceOf(to_), 0);
        assertEq(mockERC721.totalSupply(), 0);

        faucet.requestERC721Tokens(to_);

        assertEq(mockERC721.balanceOf(to_), 1);
        assertEq(mockERC721.totalSupply(), 1);
    }

    function test_MockERC721_burn(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC721.balanceOf(to_), 0);
        assertEq(mockERC721.totalSupply(), 0);

        faucet.requestERC721Tokens(to_);

        assertEq(mockERC721.balanceOf(to_), 1);

        vm.prank(to_);

        mockERC721.burn(0);

        assertEq(mockERC721.balanceOf(to_), 0);
        assertEq(mockERC721.totalSupply(), 0);
    }

    function test_MockERC20_requestTokenBeforeLockTime(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC20.balanceOf(to_), 0);
        assertEq(mockERC20.totalSupply(), 0);

        faucet.requestERC20Tokens(to_);

        assertEq(mockERC20.balanceOf(to_), BASIC_MINT_AMOUNT);
        assertEq(mockERC20.totalSupply(), BASIC_MINT_AMOUNT);

        vm.warp(block.timestamp + 1);
        verify_revertCall(RevertStatus.Faucet_InsufficientTimeElapsed);
        faucet.requestERC20Tokens(to_);
    }

    function test_MockERC721_requestTokenBeforeLockTime(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC721.balanceOf(to_), 0);
        assertEq(mockERC721.totalSupply(), 0);

        faucet.requestERC721Tokens(to_);

        assertEq(mockERC721.balanceOf(to_), 1);
        assertEq(mockERC721.totalSupply(), 1);

        vm.warp(block.timestamp + 1);
        verify_revertCall(RevertStatus.Faucet_InsufficientTimeElapsed);
        faucet.requestERC721Tokens(to_);
    }

    function test_requestTokenBeforeLockTime(
        address to_
    ) public {
        vm.assume(to_ != address(0));

        assertEq(mockERC20.balanceOf(to_), 0);
        assertEq(mockERC20.totalSupply(), 0);

        faucet.requestERC20Tokens(to_);

        assertEq(mockERC20.balanceOf(to_), BASIC_MINT_AMOUNT);
        assertEq(mockERC20.totalSupply(), BASIC_MINT_AMOUNT);

        vm.warp(block.timestamp + 1);
        verify_revertCall(RevertStatus.Faucet_InsufficientTimeElapsed);
        faucet.requestERC20Tokens(to_);
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

    function test_requestAll_then_requestToken_onSameBlock() public {
        address to_ = address(100);
        uint256 currentBalance = address(to_).balance;
        uint256 expectedBalance = currentBalance + BASIC_MINT_AMOUNT;

        assertEq(address(to_).balance, currentBalance);
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);

        faucet.requestAll(to_);
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
        assertEq(address(faucet).balance, BASIC_MINT_AMOUNT);
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
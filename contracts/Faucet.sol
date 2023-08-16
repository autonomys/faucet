// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Faucet {
    address payable public owner = payable(msg.sender);

    uint256 public withdrawalAmount = 0.0006 * (10**18);
    uint256 public lockTime = 1 minutes;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => uint256) nextAccessTime;

    function requestTokens(address payable recipient) public onlyOwner {
        require(
            msg.sender != address(0),
            "Request must not originate from a zero account"
        );
        require(
            address(this).balance >= withdrawalAmount, 
            "Insufficient balance in faucet for withdrawal request"
        );
        require(
            block.timestamp >= nextAccessTime[recipient],
            "Insufficient time elapsed since last withdrawal"
        );
        nextAccessTime[recipient] = block.timestamp + lockTime;
        recipient.transfer(withdrawalAmount);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * (10**18);
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function withdraw() external onlyOwner {
        require(
            address(this).balance > 0,
            "No balance left in the contract"
        );
        owner.transfer(address(this).balance);
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}
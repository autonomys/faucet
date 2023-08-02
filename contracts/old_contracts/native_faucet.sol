// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;


contract Faucet3 {
    address payable owner;
    address public token;

    uint256 public withdrawalAmount = 0.0006 * (10**18);
    uint256 public lockTime = 1 minutes;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => uint256) nextAccessTime;

    constructor(address tokenAddress) payable {
        token = address(tokenAddress);
        owner = payable(msg.sender);
    }

    function requestTokens(address payable recipient) public onlyOwner() {
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
        uint256 tokenBalance;
        (bool success, bytes memory data) = token.staticcall(abi.encodeWithSignature("balanceOf(address)", address(this)));
        if (success) {
            tokenBalance = abi.decode(data, (uint256));
        }
        emit Withdrawal(msg.sender, tokenBalance);
        (success, ) = token.call(abi.encodeWithSignature("transfer(address,uint256)", msg.sender, tokenBalance));
        require(success, "Transfer failed");
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}

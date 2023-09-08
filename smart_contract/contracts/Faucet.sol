// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import './interfaces/IMockERC20.sol';
import './interfaces/IMockERC721.sol';
import './abstracts/MinterRole.sol';

enum FaucetType {
    NATIVE,
    ERC20,
    ERC721
}

contract Faucet is MinterRole {
    uint256 public withdrawalAmount = 0.0006 * (10**18);
    uint256 public lockTime = 1 minutes;

    IMockERC20 public mockERC20;
    IMockERC721 public mockERC721;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => mapping(FaucetType => uint256)) private _lastAccessTime;

    constructor(address _mockERC20, address _mockERC721) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        mockERC20 = IMockERC20(_mockERC20);
        mockERC721 = IMockERC721(_mockERC721);
    }

    /// @notice Allow faucet owner to dispatch native tokens to the given address.
    /// @param recipient The address to send tokens to.
    function requestTokens(address recipient) public hasMinterRole {
        _beforeDispatchTokens(recipient, FaucetType.NATIVE);

        // If check pass transfer the tokens
        require(payable(recipient).send(withdrawalAmount), "Faucet: Failed to send native tokens");
    }

    /// @notice Allow faucet owner to dispatch ERC20 tokens to the given address.
    /// @param recipient The address to send tokens to.
    function requestERC20Tokens(address recipient) public hasMinterRole {
        _beforeDispatchTokens(recipient, FaucetType.ERC20);

        // If check pass transfer the tokens
        mockERC20.mint(recipient, withdrawalAmount);
    }

    /// @notice Allow faucet owner to dispatch ERC721 tokens to the given address.
    /// @param recipient The address to send tokens to.
    function requestERC721Tokens(address recipient) public hasMinterRole {
        _beforeDispatchTokens(recipient, FaucetType.ERC721);

        // If check pass transfer the tokens
        mockERC721.mint(recipient);
    }

    /// @notice Allow faucet owner to dispatch native, ERC20 and ERC721 tokens to the given address.
    /// @param recipient The address to send tokens to.
    function requestAll(address recipient) public hasMinterRole {
        requestTokens(recipient);
        requestERC20Tokens(recipient);
        requestERC721Tokens(recipient);
    }

    /// @notice Show the next access time for the given address and faucet type.
    /// @param recipient The address to send tokens to.
    /// @param faucetType The type of faucet (Native, ERC20, ERC721)
    /// @return The next access time for the given address and faucet type.
    function nextAccessTime(address recipient, FaucetType faucetType) public view returns (uint256) {
        return _lastAccessTime[recipient][faucetType] + lockTime;
    }

    /// @notice Allow faucet owner to change the withdrawal amount. (native and ERC20 tokens)
    /// @param amount The amount to send.
    function setWithdrawalAmount(uint256 amount) public hasAdminRole {
        withdrawalAmount = amount;
    }

    /// @notice Allow faucet owner to change the delay between withdrawals.
    /// @param amount The amount of time to lock the faucet for. (for each receiver/type)
    function setLockTime(uint256 amount) public hasAdminRole {
        lockTime = amount;
    }

    /// @notice Allow faucet owner to withdraw the native tokens from the contract.
    function withdraw() external hasAdminRole {
        require(
            address(this).balance > 0,
            "Faucet: No balance left in the contract"
        );
        address payable receiver = payable(_msgSender());
        receiver.transfer(address(this).balance);
    }

    /// @notice Check if the faucet has enough balance and if the user has waited enough time to withdraw.
    /// @param recipient The address to send tokens to.
    /// @param faucetType The type of faucet (Native, ERC20, ERC721)
    function _beforeDispatchTokens(address recipient, FaucetType faucetType) private {
        require(
            nextAccessTime(recipient, faucetType) <= block.timestamp,
            "Faucet: Insufficient time elapsed since last withdrawal"
        );

        // If check pass set the next access time
        _lastAccessTime[recipient][faucetType] = block.timestamp;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}
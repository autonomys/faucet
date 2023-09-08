// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockERC20
 */

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '../abstracts/FaucetRole.sol';

contract MockERC20 is ERC20, FaucetRole {
    constructor() ERC20('MockERC20', 'MOCK') {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Allow faucet to mint tokens to the given address.
    /// @param _to The address to mint tokens to.
    /// @param _amount The amount of tokens to mint.
    function mint(address _to, uint256 _amount) public hasFaucetRole {
        require(_to != address(0));
        require(_amount > 0);
        _mint(_to, _amount);
    }

  /// @notice Allow anyone to burn tokens from their own address.
  /// @param _amount The amount of tokens to burn.
    function burn(uint256 _amount) public {
        require(_amount > 0);
        _burn(_msgSender(), _amount);
    }
}

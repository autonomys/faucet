// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IMockERC20 is IERC20 {
  /// @notice Allow faucet to mint tokens to the given address.
  /// @param _to The address to mint tokens to.
  /// @param _amount The amount of tokens to mint.
  function mint(address _to, uint256 _amount) external;

  /// @notice Allow anyone to burn tokens from their own address.
  /// @param _amount The amount of tokens to burn.
  function burn(uint256 _amount) external view returns (bytes32);
}

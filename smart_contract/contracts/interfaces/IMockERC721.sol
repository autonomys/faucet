// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IMockERC721 is IERC721 {
  /// @notice Allow faucet to mint tokens to the given address.
  /// @param _to The address to mint tokens to.
  function mint(address _to) external;

  /// @notice Allow anyone to burn tokens from their own address.
  /// @param _tokenId The tokenId of the token to burn.
  function burn(uint256 _tokenId) external view returns (bytes32);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockERC721
 */

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '../abstracts/FaucetRole.sol';

contract MockERC721 is ERC721, FaucetRole {
    uint256 public totalSupply = 0;
    uint256 public lastToken = 0;
    constructor() ERC721('MockERC721', 'MOCK') {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Allow faucet to mint tokens to the given address.
    /// @param _to The address to mint tokens to.
    function mint(address _to) public hasFaucetRole {
        require(_to != address(0));
        _mint(_to, lastToken);
        totalSupply++;
        lastToken++;
    }

    /// @notice Allow anyone to burn tokens from their own address.
    /// @param _tokenId The tokenId of the token to burn.
    function burn(uint256 _tokenId) public {
        require(_exists(_tokenId));
        _burn(_tokenId);
        totalSupply--;
    }

    /// @notice Returns true if the contract implements the interface defined by interfaceId. See ERC-165.
    /// @param interfaceId The interface identifier, as specified in ERC-165.
    /// @return True if the contract implements interfaceId.
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, AccessControlEnumerable) returns (bool) {
        return
        ERC721.supportsInterface(interfaceId) ||
        AccessControlEnumerable.supportsInterface(interfaceId);
    }
}

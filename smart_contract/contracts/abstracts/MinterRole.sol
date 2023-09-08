// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/access/AccessControlEnumerable.sol';

contract MinterRole is AccessControlEnumerable {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  modifier hasAdminRole() {
    require(isAdmin(msg.sender), 'MinterRole: Not a admin');
    _;
  }

  modifier hasMinterRole() {
    require(isMinter(msg.sender), 'MinterRole: Not a minter');
    _;
  }

  /// @notice Return if a address has admin role
  /// @param admin The address to verify
  /// @return True if the address has admin role
  function isAdmin(address admin) public view returns (bool) {
    return hasRole(DEFAULT_ADMIN_ROLE, admin);
  }

  /// @notice Give Admin Role to the given address.
  /// @param admin The address to give the Admin Role.
  /// @dev The call must originate from an admin.
  function addAdmin(address admin) public hasAdminRole {
    grantRole(DEFAULT_ADMIN_ROLE, admin);
  }

  /// @notice Revoke Admin Role from the given address.
  /// @param admin The address to revoke the Admin Role.
  /// @dev The call must originate from an admin.
  function removeAdmin(address admin) public hasAdminRole {
    revokeRole(DEFAULT_ADMIN_ROLE, admin);
  }

  /// @notice Return if a address has minter role
  /// @param minter The address to verify
  /// @return True if the address has minter role
  function isMinter(address minter) public view returns (bool) {
    return hasRole(MINTER_ROLE, minter);
  }

  /// @notice Give minter role to the given address.
  /// @param minter The address to give the Minter Role.
  /// @dev The call must originate from an admin.
  function addMinter(address minter) public hasAdminRole {
    grantRole(MINTER_ROLE, minter);
  }

  /// @notice Revoke minter role from the given address.
  /// @param minter The address to revoke the Minter Role.
  /// @dev The call must originate from an admin.
  function removeMinter(address minter) public hasAdminRole {
    revokeRole(MINTER_ROLE, minter);
  }
}

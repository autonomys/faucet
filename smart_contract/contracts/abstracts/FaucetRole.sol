// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import '@openzeppelin/contracts/access/AccessControlEnumerable.sol';

contract FaucetRole is AccessControlEnumerable {
  bytes32 public constant FAUCET_ROLE = keccak256('FAUCET_ROLE');

  modifier hasAdminRole() {
    require(isAdmin(msg.sender), 'FaucetRole: Not a admin');
    _;
  }

  modifier hasFaucetRole() {
    require(isFaucet(msg.sender), 'FaucetRole: Not a faucet');
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

  /// @notice Return if a address has faucet role
  /// @param faucet The address to verify
  /// @return True if the address has faucet role
  function isFaucet(address faucet) public view returns (bool) {
    return hasRole(FAUCET_ROLE, faucet);
  }

  /// @notice Give faucet role to the given address.
  /// @param faucet The address to give the Faucet Role.
  /// @dev The call must originate from an admin.
  function addFaucet(address faucet) public hasAdminRole {
    grantRole(FAUCET_ROLE, faucet);
  }

  /// @notice Revoke faucet role from the given address.
  /// @param faucet The address to revoke the Faucet Role.
  /// @dev The call must originate from an admin.
  function removeFaucet(address faucet) public hasAdminRole {
    revokeRole(FAUCET_ROLE, faucet);
  }
}

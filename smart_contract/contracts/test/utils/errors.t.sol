// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { stdJson } from 'foundry-test-utility/contracts/utils/stdJson.sol';
import { Vm } from 'foundry-test-utility/contracts/utils/vm.sol';
import { DSTest } from 'foundry-test-utility/contracts/utils/test.sol';

contract Errors is DSTest {
  using stdJson for string;

  Vm public constant vm = Vm(address(uint160(uint256(keccak256('hevm cheat code')))));

  mapping(RevertStatus => string) private _errors;

  // Add a revert error to the enum of errors.
  enum RevertStatus {
    SUCCESS,
    SKIP_VALIDATION,
    ANY_REVERT,
    // Faucet
    Faucet_FailSendingNativeToken,
    Faucet_NoNativeTokenLeft,
    Faucet_InsufficientTimeElapsed
  }

  // Associate your error with a revert message and add it to the mapping.
  constructor() {
    // Resolve path from the Foundry project root to avoid CI working-directory issues
    string memory root = vm.projectRoot();
    string memory path = string.concat(root, '/constants/errors.json');
    string memory json = vm.readFile(path);

    // Faucet
    _errors[RevertStatus.Faucet_FailSendingNativeToken] = json.readString('.Faucet.FailSendingNativeToken');
    _errors[RevertStatus.Faucet_NoNativeTokenLeft] = json.readString('.Faucet.NoNativeTokenLeft');
    _errors[RevertStatus.Faucet_InsufficientTimeElapsed] = json.readString('.Faucet.InsufficientTimeElapsed');
  }

  // Return the error message associated with the error.
  function _verify_revertCall(RevertStatus revertType_) internal view returns (string storage) {
    return _errors[revertType_];
  }

  // Expect a revert error if the revert type is not success.
  function verify_revertCall(RevertStatus revertType_) public {
    if (revertType_ == RevertStatus.ANY_REVERT) vm.expectRevert();
    else if (revertType_ != RevertStatus.SUCCESS && revertType_ != RevertStatus.SKIP_VALIDATION)
      vm.expectRevert(bytes4(keccak256(bytes(_verify_revertCall(revertType_)))));
  }

  function test_coverageIgnore() internal pure virtual {}
}

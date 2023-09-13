// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'foundry-test-utility/contracts/utils/console.sol';
import { Errors } from './errors.t.sol';

contract Constants is Errors {
  uint256 ADMIN_PK = 42_000;
  address ADMIN = vm.addr(ADMIN_PK);

  uint256 public BASIC_MINT_AMOUNT = 0.0006 * (10**18);
  uint256 public BASIC_TIME_LOCK = 1 minutes;
}

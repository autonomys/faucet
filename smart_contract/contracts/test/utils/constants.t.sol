// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { stdJson } from 'foundry-test-utility/contracts/utils/stdJson.sol';
import 'foundry-test-utility/contracts/utils/console.sol';
import { Errors } from './errors.t.sol';

contract Constants is Errors {
  using stdJson for string;

  string MockERC20_CONTRACT_NAME;
  string MockERC20_CONTRACT_SYMBOL;

  string MockERC721_CONTRACT_NAME;
  string MockERC721_CONTRACT_SYMBOL;

  uint256 ADMIN_PK = 42_000;
  address ADMIN = vm.addr(ADMIN_PK);

  uint256 public BASIC_MINT_AMOUNT = 0.0006 * (10**18);
  uint256 public BASIC_TIME_LOCK = 1 minutes;

  constructor() {
    string memory json = vm.readFile('./constants/values.json');

    MockERC20_CONTRACT_NAME = json.readString('.MockERC20.CONTRACT_NAME');
    MockERC20_CONTRACT_SYMBOL = json.readString('.MockERC20.CONTRACT_SYMBOL');

    MockERC721_CONTRACT_NAME = json.readString('.MockERC721.CONTRACT_NAME');
    MockERC721_CONTRACT_SYMBOL = json.readString('.MockERC721.CONTRACT_SYMBOL');
  }
}

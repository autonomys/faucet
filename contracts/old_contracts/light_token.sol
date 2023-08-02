// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract SubspaceTestToken { 
    address payable public owner;
    string public _symbol;
    string public _name;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply;
    uint256 public blockReward;

    constructor(uint256 reward) {
        owner = payable(msg.sender);
        _name = "SubspaceTestToken";
        _symbol = "QSSC";
        _mint(owner, 1000000 * (10 ** decimals())); 
        blockReward = reward * (10 ** decimals());   
    }

    function _mint(address account, uint256 amount) internal virtual {
        _update(address(0), account, amount);
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

     function name() public view virtual returns (string memory) {
        return _name;
    }

    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    function _update(address from, address to, uint256 value) internal virtual {
        if (from == address(0)) {
            _totalSupply += value;
        }
        if (to == address(0)) {
            unchecked {
                _totalSupply -= value;
            }
        } else {
            unchecked {
                _balances[to] += value;
            }
        }
    }
    
     function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

     function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }
    
}
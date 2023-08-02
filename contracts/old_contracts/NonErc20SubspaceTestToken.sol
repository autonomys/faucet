// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface CUSTOMTOKEN {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract NonErc20SubspaceTestToken is CUSTOMTOKEN{ 
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
        _symbol = "SSC";
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
        emit Transfer(from, to, value);
    }

    function transfer(address to, uint256 value) public virtual returns (bool) {
        owner = payable(msg.sender);
        _transfer(owner, to, value);
        return true;
    }

     function _transfer(address from, address to, uint256 value) internal {
        _update(from, to, value);
    }
    
     function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    function transferFrom(address from, address to, uint256 value) public virtual returns (bool) {
        address spender = payable(msg.sender);
        _spendAllowance(from, spender, value);
        _transfer(from, to, value);
        return true;
    }

     function _spendAllowance(address owner2, address spender, uint256 value) internal virtual {
        uint256 currentAllowance = allowance(owner2, spender);
        _approve(owner2, spender, currentAllowance - value, false);
    }

    function allowance(address owner3, address spender) public view virtual returns (uint256) {
        return _allowances[owner3][spender];
    }

     function _approve(address owner4, address spender, uint256 value) internal virtual {
        _approve(owner4, spender, value, true);
    }

    function _approve(address owner5, address spender, uint256 value, bool emitEvent) internal virtual {
        _allowances[owner5][spender] = value;
        if (emitEvent) {
            emit Approval(owner, spender, value);
        }
    }

     function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }
    
}
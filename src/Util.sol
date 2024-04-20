// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";

contract Util
is ERC20Upgradeable, ERC20BurnableUpgradeable
{

    function initialize() initializer public {
        __ERC20_init("Util", "UTIL");
        __ERC20Burnable_init();
    }

    // Anybody can have as many utils as they like.
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

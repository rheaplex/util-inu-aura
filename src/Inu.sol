// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {Util} from "./Util.sol";

error NeedMoreUtils();

contract Inu is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // The number from "The Number And The Siren".
    uint256 constant private NUMBER = 707;

    // The util contract, which we call to burn utils.
    address private util;

    constructor(address initialOwner, address utilContractAddress)
        ERC20("Inu", "INU")
        Ownable(initialOwner)
    {
        util = utilContractAddress;
    }

    // Anybody can have as much as they like, in return for burning Utils
    // at a particular ratio.
    // The caller must approve this contract address a suitable allowance
    // before calling.

    function burnUtilForInu(uint256 utilAmount) public {
        if (utilAmount < NUMBER) {
            revert NeedMoreUtils();
        }
        Util(util).burnFrom(msg.sender, utilAmount);
        uint256 inuAmount = utilAmount / NUMBER;
        _mint(msg.sender, inuAmount);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

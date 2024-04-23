// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {Util} from "./Util.sol";

error NeedMoreUtils();

contract Inu
is ERC20Upgradeable, ERC20BurnableUpgradeable
{
    // The number from "The Number And The Siren".
    uint256 constant private NUMBER = 707;

    // The util contract, which we call to burn utils.
    address private util;

    function initialize(address utilContractAddress) public initializer {
        __ERC20_init("Inu", "INU");
        __ERC20Burnable_init();
        util = utilContractAddress;
    }

    // Anybody can have as much as they like, in return for burning Utils
    // at a particular ratio.
    // The caller must approve this contract address a suitable allowance
    // before calling.

    function burnUtilForInu(address receiver, uint256 utilAmount) public {
        if (utilAmount < NUMBER) {
            revert NeedMoreUtils();
        }
        Util(util).burnFrom(receiver, utilAmount);
        uint256 inuAmount = utilAmount / NUMBER;
        _mint(msg.sender, inuAmount);
    }
}

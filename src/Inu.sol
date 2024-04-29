// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";;

import {Util} from "./Util.sol";

error NeedMoreUtils();

contract Inu isERC20, ERC20Burnable, ERC20Pausable, Ownable {
{
    // The number from "The Number And The Siren".
    uint256 constant private NUMBER = 707;

    // The util contract, which we call to burn utils.
    address private util;

    constructor(address initialOwner, address utilContractAddress)
        ERC20("Util", "UTIL")
        Ownable(initialOwner)
    {
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

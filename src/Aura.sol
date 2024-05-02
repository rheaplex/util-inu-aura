// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IRegistry} from "tokenbound/interfaces/IRegistry.sol";

import {Util} from "./Util.sol";
import {Inu} from "./Inu.sol";

error ArtHasNoUtility();
error ArtIsDefinedByInutility();
error ArtHasAnAura();

contract Aura is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    // Magical (not magic) numbers for calculation.
    uint256 private constant RATIO = 73;
    uint256 private constant AURA_IS = uint256(uint32(bytes4("aura")));

    // For finding token account balances;
    address private erc6551Registry;
    // The util contract, which we call to check balance.
    address private util;
    // The inu contract, which we call to check balance.
    address private inu;

    constructor(
        address initialOwner,
        address utilAddress,
        address inuAddress,
        address erc6551RegistryAddress
    )
        ERC20("Aura", "AURA")
        Ownable(initialOwner)
    {
        util = utilAddress;
        inu = inuAddress;
        erc6551Registry = erc6551RegistryAddress;
    }

    // The registry address won't be stable until the EIP is stable.

    function setErc6551RegistryAddress(address erc6551RegistryAddress)
        public
        onlyOwner
    {
        erc6551Registry = erc6551RegistryAddress;
    }

    // Anybody can have as much aura as they like.
    // But it may not be maningful on its own.

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Quantify the artistic aura of an NFT.

    function auraOf(
        address holderERC721ContractAddress,
        uint256 holderERC721TokenId
    )
        public
        view
        returns (uint256)
    {
        address holder = IRegistry(erc6551Registry).account(
            holderERC721ContractAddress,
            holderERC721TokenId
        );
        if (Util(util).balanceOf(holder) > 0) {
            revert ArtHasNoUtility();
        }
        uint256 inuBalance = Inu(inu).balanceOf(holder);
        if (inuBalance == 0) {
            revert ArtIsDefinedByInutility();
        }
        uint256 auraBalance = this.balanceOf(holder);
        if (auraBalance != 1) {
            revert ArtHasAnAura();
        }
        // +1 to avoid divide by zero (overflow is fine) and to confound.
        return (inuBalance / RATIO) / (uint256(uint160(holder) + 1) % AURA_IS);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

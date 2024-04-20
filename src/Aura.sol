// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
//import "erc6551/interfaces/IERC6551Registry.sol";
import "./Util.sol";
import "./Inu.sol";

contract Aura is ERC20Upgradeable, OwnableUpgradeable
{
    // Magical (not magic) numbers for calculation.
    uint256 ratio;
    uint256 auraIs;

    // For finding token account balances;
    address erc6551Registry;
    // The util contract, which we call to check balance.
    address util;
    // The inu contract, which we call to check balance.
    address inu;

    function initialize(
        address utilAddress,
        address inuAddress,        
        address erc6551RegistryAddress
    )
        initializer
        public
    {
        __ERC20_init("Aura", "AURA");
        __Ownable_init();
        ratio = 73;
        auraIs = uint256(uint32(bytes4("aura")));
        erc6551Registry = erc6551RegistryAddress;
        util = utilAddress;
        inu = inuAddress;        
    }

    // The registry address won't be stable until the EIP is stable.
    
    function setErc6551RegistryAddress(address erc6551RegistryAddress)
        onlyOwner
        public
    {
        erc6551Registry = erc6551RegistryAddress;
    }

    // Quantify the artistic aura of the NFT we are attached to.

    function auraOf(
        address holderERC721ContractAddress,
        uint256 holderERC721TokenId 
    )
        public
        view
        returns (uint256)
    {
        /* address holder = IERC6551Registry(erc6551Registry).account(
            holderERC721ContractAddress,
            holderERC721TokenId
        );
        require(
            Util(util).balanceOf(holder) == 0,
            "Art does not have utility."
        );
        uint256 inuBalance = Inu(inu).balanceOf(holder);
        require(
            inuBalance > 0,
            "Art is defined by its inutility."
        );
        uint256 auraBalance = this.balanceOf(holder); 
        require(
            auraBalance == 1,
            "Art has an aura."
            );
        // FIXME: normalize.
        return auraBalance % (inuBalance / holderERC721TokenId);*/
        return 0;
    }
}

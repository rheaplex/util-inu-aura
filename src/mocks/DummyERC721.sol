// From: https://wizard.openzeppelin.com/#erc721
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DummyERC721 is ERC721, Ownable {

    constructor(address initialOwner)
        ERC721("DummyERC721", "DMY")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
    }
}

// From: https://wizard.openzeppelin.com/#erc721
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DummyERC721 is ERC721URIStorage, Ownable {

    constructor(address initialOwner)
        ERC721("DummyERC721", "DMY")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 tokenId, string memory tokenURI)
        public
        onlyOwner
    {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}

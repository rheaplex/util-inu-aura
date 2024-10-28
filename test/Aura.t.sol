// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";

import {AccountV2} from "tokenbound/Account.sol";
import {CrossChainExecutorList} from "tokenbound/CrossChainExecutorList.sol";
import {AccountRegistry} from "tokenbound/AccountRegistry.sol";

import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";
import {Aura, ArtHasNoUtility, ArtIsDefinedByInutility, ArtHasAnAura}
from "../src/Aura.sol";
import {DummyERC721} from "../src/mocks/DummyERC721.sol";

contract AuraTest is Test {

    AccountV2       private implementation;
    AccountRegistry public registry;

    Util        public util;
    Inu         public inu;
    Aura        public aura;
    DummyERC721 public nft;

    function setUp() public {
        CrossChainExecutorList crosschain = new CrossChainExecutorList();
        implementation = new AccountV2(address(crosschain));
        registry = new AccountRegistry(address(implementation));

        util = new Util(msg.sender);
        inu = new Inu(msg.sender, address(util));
        aura = new Aura(
            msg.sender,
            address(util),
            address(inu),
            address(registry)
        );

        nft = new DummyERC721(address(this));
    }

    function testDeployment() public view {
        assertEq(aura.name(), "Aura");
        assertEq(aura.symbol(), "AURA");
    }

    function testAuraOf() public {
        uint256 amount = 707 * 999999999999;
        nft.mint(
            address(this),
            1,
            "ipfs://QmcytekE6LeYqCnrr9pj5eHnqgKTV6HYAgM4G4t3GRPd4s/metadata.json"
        );
        address nftAccount = registry.createAccount(
            address(nft),
            1
        );

        vm.expectRevert(ArtIsDefinedByInutility.selector);
        aura.auraOf(address(nft), 1);
        util.mint(address(this), amount);
        util.approve(address(inu), amount);
        inu.burnUtilForInu(amount);
        inu.transfer(nftAccount, 707);

        vm.expectRevert(ArtHasAnAura.selector);
        aura.auraOf(address(nft), 1);

        aura.mint(nftAccount, 1);
        assertEq(aura.auraOf(address(nft), 1), 0);
        inu.transfer(nftAccount, inu.balanceOf(address(this)));
        assertEq(aura.auraOf(address(nft), 1), 25);

        util.mint(nftAccount, 1);
        vm.expectRevert(ArtHasNoUtility.selector);
        aura.auraOf(address(nft), 1);

    }
}

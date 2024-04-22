// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

import {AccountV2} from "tokenbound/Account.sol";
import {CrossChainExecutorList} from "tokenbound/CrossChainExecutorList.sol";
import {AccountRegistry} from "tokenbound/AccountRegistry.sol";

import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";
import {Aura} from "../src/Aura.sol";
import {DummyERC721} from "../src/mocks/DummyERC721.sol";

contract AuraTest is Test {

    AccountV2 implementation;
    AccountRegistry public registry;

    Util        public util;
    Inu         public inu;
    Aura        public aura;
    DummyERC721 public nft;

    function setUp() public {
        CrossChainExecutorList crosschain = new CrossChainExecutorList();
        implementation = new AccountV2(address(crosschain));
        registry = new AccountRegistry(address(implementation));

        address utilProxy = Upgrades.deployUUPSProxy(
            "Util.sol",
            abi.encodeCall(Util.initialize, ())
        );
        util = Util(utilProxy);

        address inuProxy = Upgrades.deployUUPSProxy(
            "Inu.sol",
            abi.encodeCall(Inu.initialize, (utilProxy))
        );
        inu = Inu(inuProxy);

        address auraProxy = Upgrades.deployUUPSProxy(
            "Aura.sol",
            abi.encodeCall(
                Aura.initialize,
                (
                    utilProxy,
                    inuProxy,
                    address(registry)
                )
            )
        );
        aura = Aura(auraProxy);

        nft = new DummyERC721(address(this));
    }

    function test_Deployment() public view {
        assertEq(aura.name(), "Aura");
        assertEq(aura.symbol(), "AURA");
    }

    function test_AuraOf() public {
        uint256 amount = 707 * 100000000000000;
        nft.mint(address(this), 1);
        address nftAccount = registry.createAccount(
            address(nft),
            1
        );

        vm.expectRevert(bytes("Art is defined by its inutility."));
        aura.auraOf(address(nft), 1);
        util.mint(address(this), amount);
        util.approve(address(inu), amount);
        inu.burnUtilForInu(address(this), amount);

        inu.transfer(nftAccount, 73);
        vm.expectRevert(bytes("Art has an aura."));
        
        aura.auraOf(address(nft), 1);
        aura.mint(nftAccount, 1);
        assertEq(aura.auraOf(address(nft), 1), 0);
        inu.transfer(nftAccount, 73);
        assertEq(aura.auraOf(address(nft), 1), 1);
        inu.transfer(nftAccount, 146);
        assertEq(aura.auraOf(address(nft), 1), 2);

        util.mint(address(nftAccount), amount);
        vm.expectRevert(bytes("Art has no utility."));
        aura.auraOf(address(nft), 1);

        address nftAccount2 = registry.createAccount(
            address(nft),
            1377
        );
        aura.mint(nftAccount2, 1);
        inu.transfer(nftAccount2, 1378 * 73);
        assertEq(aura.auraOf(address(nft), 1377), 1);
        inu.transfer(nftAccount2, 1378 * 73);
        assertEq(aura.auraOf(address(nft), 1377), 2);
    }
}

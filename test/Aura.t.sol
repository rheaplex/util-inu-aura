// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

import {AccountRegistry} from "tokenbound/AccountRegistry.sol";
import {Account} from "tokenbound/Account.sol";

contract AccountERC20Test is Test {

    Account implementation;
    AccountRegistry public registry;

    function setUp() public {

        //implementation = new AccountV3(address(1), address(1), address(1), address(1));
        registry = new AccountRegistry();
    }

    function testSomething() public {
        assertEq(true, true);
    }

}
/*
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import "erc6551/ERC6551Registry.sol";
//import "erc6551/interfaces/IERC6551Account.sol";
import "tokenbound/AccountV3.sol";
//import "tokenbound/AccountGuardian.sol";
import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";
import {Aura} from "../src/Aura.sol";
import {DummyERC721} from "../src/mocks/DummyERC721.sol";

contract InuTest is Test {
    Util        public util;
    Inu         public inu;
    Aura        public aura;
    DummyERC721 public nft;

    AccountV3              implementation;
    ERC6551Registry public registry;

    function setUp() public {
        address utilProxy = Upgrades.deployUUPSProxy(
            "Util.sol",
            abi.encodeCall(Util.initialize, ())
        );
        util = Util(utilProxy);

        implementation = new AccountV3(
            address(1),
            address(1),
            address(1),
            address(1)
        );
        registry = new ERC6551Registry();

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
                    address(this),
                    utilProxy,
                    inuProxy,
                    registry
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
}
*/

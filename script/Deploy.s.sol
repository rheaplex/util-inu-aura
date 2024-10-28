// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import {AccountV2} from "tokenbound/Account.sol";
import {CrossChainExecutorList} from "tokenbound/CrossChainExecutorList.sol";
import {AccountRegistry} from "tokenbound/AccountRegistry.sol";

import {DummyERC721} from "../src/mocks/DummyERC721.sol";

import {console2, Script} from "forge-std/Script.sol";
import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";
import {Aura} from "../src/Aura.sol";

// solhint-disable no-console

contract Deploy is Script {
    // https://github.com/erc6551/reference
    address private erc6551RegistryAddress
        = 0x000000006551c19487814612e58FE06813775758;

    function run() external {

        vm.startBroadcast();

        Util util = new Util(msg.sender);

        Inu inu = new Inu(msg.sender, address(util));

        Aura aura = new Aura(
            msg.sender,
            address(util),
            address(inu),
            erc6551RegistryAddress
        );

        if (block.chainid == 31337) {
            CrossChainExecutorList crosschain = new CrossChainExecutorList();
            AccountV2 implementation = new AccountV2(address(crosschain));
            AccountRegistry registry = new AccountRegistry(address(implementation));
            console2.log(msg.sender);
            console2.log(address(aura.owner()));
            console2.log(address(aura));
            console2.log(address(registry));
            aura.setErc6551RegistryAddress(address(registry));
            DummyERC721 nft = new DummyERC721(msg.sender);

            nft.mint(
                address(this),
                1,
                "ipfs://QmcytekE6LeYqCnrr9pj5eHnqgKTV6HYAgM4G4t3GRPd4s/metadata.json"
            );
            address nftAccount = registry.createAccount(
                address(nft),
                1
            );

            uint256 amount = 707 * 999999999999;
            util.mint(
                msg.sender,
                amount
            );
            util.approve(address(inu), amount);
            inu.burnUtilForInu(amount);

            inu.transfer(nftAccount, inu.balanceOf(msg.sender));
            aura.mint(nftAccount, 1);
            console2.log("======> TEST NFT 1: %s %d", address(nft), 1);
            console2.log("======> AURA: %d", aura.auraOf(address(nft), 1));
            console2.log(
                "======> UTIL: %s INU: %s AURA: %s",
                util.balanceOf(nftAccount),
                inu.balanceOf(nftAccount),
                aura.balanceOf(nftAccount)
            );

            nft.mint(
                address(this),
                2,
                "ipfs://QmVksLULmWtShCXbj5q12RX4KNdHEFkKEnAJmybAhPES45/metadata.json"
            );
            console2.log("======> TEST NFT 2: %s %d", address(nft), 2);
        }

        vm.stopBroadcast();
    }

}

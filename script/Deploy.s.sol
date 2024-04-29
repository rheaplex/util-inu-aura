// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import {Script} from "forge-std/Script.sol";
import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";
import {Aura} from "../src/Aura.sol";

contract Deploy is Script {
    // https://github.com/erc6551/reference
    address private erc6551RegistryAddress
        = 0x000000006551c19487814612e58FE06813775758;

    function run() external {
        vm.startBroadcast();

        Util util = new Util(msg.sendr);

        Inu inu = new Inu(msg.sender, address(util));

        Aura aura = new Aura(
            msg.sender,
            address(util),
            address(inu),
            erc6551RegistryAddress
        );

        vm.stopBroadcast();
    }
}

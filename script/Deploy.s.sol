// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
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

        address utilProxy = Upgrades.deployUUPSProxy(
            "Util.sol",
            abi.encodeCall(Util.initialize, ())
        );

        address inuProxy = Upgrades.deployUUPSProxy(
            "Inu.sol",
            abi.encodeCall(Inu.initialize, (utilProxy))
        );

        Upgrades.deployUUPSProxy(
            "Aura.sol",
            abi.encodeCall(
                Aura.initialize,
                (
                    utilProxy,
                    inuProxy,
                    address(erc6551RegistryAddress)
                )
            )
        );
        
        vm.stopBroadcast();
    }
}

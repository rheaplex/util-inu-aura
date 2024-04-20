// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Util} from "../src/Util.sol";

contract UtilTest is Test {
    Util public util;

    function setUp() public {
        address proxy = Upgrades.deployUUPSProxy(
            "Util.sol",
            abi.encodeCall(Util.initialize, ())
        );
        util = Util(proxy);
    }

    function test_Deployment() public view{
        assertEq(util.name(), "Util");
        assertEq(util.symbol(), "UTIL");
    }

    function test_mint(uint256 amount) public {
        util.mint(msg.sender, amount);
        assertEq(util.balanceOf(msg.sender), amount);
    }
}

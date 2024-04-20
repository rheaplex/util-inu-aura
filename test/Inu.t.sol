// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";

contract InuTest is Test {
    Util public util;
    Inu public  inu;

    function setUp() public {
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
    }

    function test_Deployment() public view {
        assertEq(inu.name(), "Inu");
        assertEq(inu.symbol(), "INU");
    }

    function burnUtilForInu(address from, uint256 amount) internal {
        util.mint(from, amount);
        util.approve(address(inu), amount);
        inu.burnUtilForInu(from, amount);
    }

    function test_burnUtilForInu() public {
        burnUtilForInu(address(this), 707);
        assertEq(util.balanceOf(address(this)), 0);
        assertEq(inu.balanceOf(address(this)), 1);

        burnUtilForInu(address(this), 2000);
        assertEq(util.balanceOf(address(this)), 0);
        assertEq(inu.balanceOf(address(this)), 3);
    }

    function testFail_burnUtilForInu() public {
        burnUtilForInu(address(this), 700);
    }
}

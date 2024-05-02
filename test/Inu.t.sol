// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {Util} from "../src/Util.sol";
import {Inu} from "../src/Inu.sol";

contract InuTest is Test {
    Util public util;
    Inu public  inu;

    function burnUtilForInu(address recipient, uint256 amount) internal {
        util.mint(address(this), amount);
        util.approve(address(inu), amount);
        inu.burnUtilForInu(amount);
        inu.transfer(recipient, amount / 707);
    }

    function setUp() public {
        util = new Util(msg.sender);
        inu = new Inu(msg.sender, address(util));
    }

    function testDeployment() public view {
        assertEq(inu.name(), "Inu");
        assertEq(inu.symbol(), "INU");
    }

    function testBurnUtilForInu() public {
        burnUtilForInu(address(this), 707);
        assertEq(util.balanceOf(address(this)), 0);
        assertEq(inu.balanceOf(address(this)), 1);

        burnUtilForInu(address(this), 2000);
        assertEq(util.balanceOf(address(this)), 0);
        assertEq(inu.balanceOf(address(this)), 3);
    }

    function testFailBurnUtilForInu() public {
        burnUtilForInu(address(this), 700);
    }
}

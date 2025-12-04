// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Season2Challenge12Dungeon.sol";

contract Season2Challenge12Victory {
    address public challenge12Dungeon;
    mapping(address => bool) public victory;

    constructor(address _challenge12Dungeon) {
        challenge12Dungeon = _challenge12Dungeon;
    }

    function free(bool value) public {
        victory[tx.origin] = value;
    }

    function winner() public view returns (bool) {
        return
            (Season2Challenge12Dungeon(challenge12Dungeon).dungeon(tx.origin) >
                0)
                ? victory[tx.origin]
                : false;
    }
}

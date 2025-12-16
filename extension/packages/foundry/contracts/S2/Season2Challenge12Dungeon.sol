// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Season2Challenge12Quest.sol";

contract Season2Challenge12Dungeon {
    address public challenge12Quest;
    mapping(address => bytes32) public dungeon;

    constructor(address _challenge12Quest) {
        challenge12Quest = _challenge12Quest;
    }

    function setPosition(bytes32 value) public {
        dungeon[tx.origin] = value;
    }

    function getCurrentPosition() public view returns (uint256) {
        return
            Season2Challenge12Quest(challenge12Quest).quest(tx.origin) *
            uint256(dungeon[tx.origin]);
    }
}

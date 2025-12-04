// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Season2Challenge12Quest {
    mapping(address => uint256) public quest;

    function setCurrentQuest(uint256 value) public {
        quest[tx.origin] = value;
    }
}

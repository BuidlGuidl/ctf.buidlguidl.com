// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Season2Challenge12Inventory is Ownable(msg.sender) {
    mapping(address => uint256) public inventory;

    function setValue(uint256 value) public onlyOwner {
        inventory[tx.origin] = value;
    }
}

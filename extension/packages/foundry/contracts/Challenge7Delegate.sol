//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Challenge7Delegate {
    address public owner;

    event OwnerChange(address indexed owner);

    constructor(address _owner) {
        owner = _owner;
        emit OwnerChange(_owner);
    }

    function claimOwnership() public {
        owner = msg.sender;
        emit OwnerChange(msg.sender);
    }
}

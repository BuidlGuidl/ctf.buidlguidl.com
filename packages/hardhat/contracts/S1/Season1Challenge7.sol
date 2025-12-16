//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season1Challenge7Delegate {
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

contract Season1Challenge7 {
    address public owner;
    Season1Challenge7Delegate delegate;
    address public nftContract;

    constructor(address _nftContract, address _delegateAddress, address _owner) {
        nftContract = _nftContract;
        delegate = Season1Challenge7Delegate(_delegateAddress);
        owner = _owner;
    }

    function mintFlag() public {
        require(msg.sender == owner, "Only owner");
        INFTFlags(nftContract).mint(msg.sender, 7);
    }

    fallback() external {
        (bool result, ) = address(delegate).delegatecall(msg.data);
        if (result) {
            this;
        }
    }
}

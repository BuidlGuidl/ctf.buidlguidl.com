//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";
import "./Season1Challenge7Delegate.sol";

contract Season1Challenge7 {
    address public owner;
    Season1Challenge7Delegate delegate;
    address public nftContract;

    constructor(
        address _nftContract,
        address _delegateAddress,
        address _owner
    ) {
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

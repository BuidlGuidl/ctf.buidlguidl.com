//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";
import "./Challenge7Delegate.sol";

contract Challenge7 {
    address public owner;
    Challenge7Delegate delegate;
    address public nftContract;

    constructor(address _nftContract, address _delegateAddress, address _owner) {
        nftContract = _nftContract;
        delegate = Challenge7Delegate(_delegateAddress);
        owner = _owner;
    }

    function mintFlag() public {
        require(msg.sender == owner, "Only owner");
        INFTFlags(nftContract).mint(msg.sender, 7);
    }

    fallback() external {
        (bool result,) = address(delegate).delegatecall(msg.data);
        if (result) {
            this;
        }
    }
}

//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge2 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function justCallMe() public {
        require(msg.sender != tx.origin, "Not allowed");
        INFTFlags(nftContract).mint(tx.origin, 2);
    }
}

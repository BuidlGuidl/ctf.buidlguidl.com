//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge3 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag() public {
        require(msg.sender != tx.origin, "Not allowed");

        uint256 x;
        assembly {
            x := extcodesize(caller())
        }

        require(x == 0, "Size not zero");

        INFTFlags(nftContract).mint(tx.origin, 3);
    }
}

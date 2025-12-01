// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./NFTFlags.sol";

contract Season2Challenge5 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag(uint[] memory data1, uint[] memory data2) public {
        uint256 tokenIdCounter = NFTFlags(nftContract).tokenIdCounter();
        uint256 counter1;
        uint256 counter2;

        assembly {
            counter1 := mload(add(data1, 0xD0))
            counter2 := mload(data2)
        }

        require(counter1 == tokenIdCounter, "Wrong counter1");
        require(counter2 == (tokenIdCounter % 0x80), "Wrong counter2");

        NFTFlags(nftContract).mint(tx.origin, 5);
    }
}

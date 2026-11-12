// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season3Challenge5 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag(uint256[] calldata data1, uint256[] calldata data2) external {
        bytes32 seed = keccak256(abi.encodePacked(tx.origin, address(this)));

        uint256 tag;
        uint256 size;
        assembly {
            tag := calldataload(0x44)
            size := calldatasize()
        }

        require(size == 0xe4, "Wrong size");
        require(address(uint160(tag)) == tx.origin, "Wrong tag");
        require(uint96(tag >> 160) == uint96(bytes12(seed)), "Dirty tag");

        require(data1.length == 3, "Wrong data1 length");
        require(data2.length == 2, "Wrong data2 length");
        require(data1[1] == uint256(seed), "Wrong data1");
        require(data2[1] == ~uint256(seed), "Wrong data2");

        INFTFlags(nftContract).mint(tx.origin, 5);
    }
}

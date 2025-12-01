//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Season2Challenge2 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag(bytes32 yourKey) external {
        bytes32 key = keccak256(abi.encodePacked(msg.sender, address(this)));
        require(yourKey == key, "bad key :(");

        INFTFlags(nftContract).mint(tx.origin, 2);
    }
}

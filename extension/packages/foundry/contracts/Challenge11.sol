//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge11 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag() public {
        require(msg.sender != tx.origin, "Not allowed");
        uint8 senderLast = uint8(abi.encodePacked(msg.sender)[19]);
        uint8 originLast = uint8(abi.encodePacked(tx.origin)[19]);
        require((senderLast & 0x15) == (originLast & 0x15), "Not allowed");
        INFTFlags(nftContract).mint(tx.origin, 11);
    }
}

//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season2Challenge10 {
    address public nftContract;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag() public {
        require(msg.sender != tx.origin, "Same address");
        uint8 senderLast = uint8(abi.encodePacked(msg.sender)[19]);
        uint8 originLast = uint8(abi.encodePacked(tx.origin)[19]);
        uint8 contractFirst = uint8(abi.encodePacked(address(this))[0]);
        uint8 senderFirst = uint8(abi.encodePacked(msg.sender)[0]);
        require((senderLast & 0xF) == (originLast & 0xF), "Wrong sender/origin address");
        require((senderFirst & 0xF0) == (contractFirst & 0xF0), "Wrong sender/contract address");
        INFTFlags(nftContract).mint(tx.origin, 10);
    }
}

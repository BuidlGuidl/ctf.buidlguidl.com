//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./RLPReader.sol";
import "./INFTFlags.sol";

contract Challenge12 {
    using RLPReader for RLPReader.RLPItem;
    using RLPReader for bytes;

    address public nftContract;
    mapping(address => uint256) public blockNumber;
    mapping(uint256 => bool) public blocks;

    uint256 public constant futureBlocks = 2;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function preMintFlag() public {
        require(blocks[block.number] == false, "Block already used");
        blocks[block.number] = true;
        blockNumber[msg.sender] = block.number;
    }

    function mintFlag(bytes memory rlpBytes) public {
        require(blockNumber[msg.sender] != 0, "PreMintFlag first");
        require(block.number >= blockNumber[msg.sender] + futureBlocks, "Future block not reached.");
        require(block.number < blockNumber[msg.sender] + futureBlocks + 256, "You miss the window. PreMintFlag again.");

        RLPReader.RLPItem[] memory ls = rlpBytes.toRlpItem().toList();

        uint256 blockNumberFromHeader = ls[8].toUint();

        require(blockNumberFromHeader == blockNumber[msg.sender] + futureBlocks, "Wrong block");

        require(blockhash(blockNumberFromHeader) == keccak256(rlpBytes), "Wrong block header");

        INFTFlags(nftContract).mint(msg.sender, 12);
    }
}

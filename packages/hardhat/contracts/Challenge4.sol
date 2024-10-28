//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./INFTFlags.sol";

contract Challenge4 is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    address public nftContract;
    mapping(address => bool) public isMinter;

    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = _nftContract;
    }

    function addMinter(address _minter) public onlyOwner {
        isMinter[_minter] = true;

        emit MinterAdded(_minter);
    }

    function removeMinter(address _minter) public onlyOwner {
        isMinter[_minter] = false;

        emit MinterRemoved(_minter);
    }

    function mintFlag(address _minter, bytes memory signature) public {
        require(isMinter[_minter], "Not a minter");

        bytes32 message = keccak256(abi.encode("BG CTF Challenge 4", msg.sender));
        bytes32 hash = message.toEthSignedMessageHash();

        address recoveredSigner = hash.recover(signature);

        require(recoveredSigner == _minter, "Invalid signature");

        INFTFlags(nftContract).mint(msg.sender, 4);
    }
}

//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season3Challenge2 {
    uint32 public createdAt;
    bool public open;
    bytes11 private secret;
    uint64 public edition;
    address public nftContract;
    bytes32 public immutable passwordHash;

    constructor(address _nftContract, bytes32 _password) {
        nftContract = _nftContract;
        createdAt = uint32(block.timestamp);
        open = true;
        edition = 2026;
        secret = bytes11(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender, address(this))));
        passwordHash = keccak256(abi.encodePacked(_password));
    }

    function mintFlag(bytes32 yourKey, bytes32 password) external {
        require(open, "closed");
        require(keccak256(abi.encodePacked(password)) == passwordHash, "wrong password");
        bytes32 key = keccak256(abi.encode(tx.origin, secret, password, address(this)));
        require(yourKey == key, "bad key :(");

        INFTFlags(nftContract).mint(tx.origin, 2);
    }
}

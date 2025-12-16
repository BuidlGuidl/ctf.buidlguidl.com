//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season2Challenge8 {
    address public nftContract;
    bytes32 private password;
    uint256 private count;

    constructor(address _nftContract, bytes32 _password) {
        nftContract = _nftContract;
        password = _password;
    }

    modifier lock1(bytes32 _password) {
        bytes32 mask = ~(bytes32(uint256(0xFF) << ((31 - (count % 32)) * 8)));
        bytes32 newPassword = password & mask;
        require(newPassword == _password, "Wrong password");
        _;
    }

    modifier lock2() {
        require(msg.sender.balance >= 2, "Insufficient balance");
        _;
    }

    modifier lock3() {
        require(payable(msg.sender).send(1) == false, "It should fail to send ether");
        _;
    }

    modifier lock4() {
        require(payable(msg.sender).send(2) == true, "Failed to send ether");
        _;
    }

    function mintFlag(bytes32 _password) public payable lock1(_password) lock2 lock3 lock4 {
        require(msg.value == 2, "Invalid ether amount");
        count += 1;
        INFTFlags(nftContract).mint(tx.origin, 8);
    }

    receive() external payable {}
}

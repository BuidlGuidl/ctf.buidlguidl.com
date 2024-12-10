//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge9 {
    address public nftContract;
    bytes32 private password;
    uint256 private count;

    constructor(address _nftContract, bytes32 _password) {
        nftContract = _nftContract;
        password = _password;
    }

    function mintFlag(bytes32 _password) public {
        bytes32 mask = ~(bytes32(uint256(0xFF) << ((31 - (count % 32)) * 8)));
        bytes32 newPassword = password & mask;
        require(newPassword == _password, "Wrong password");
        count += 1;
        INFTFlags(nftContract).mint(msg.sender, 9);
    }
}

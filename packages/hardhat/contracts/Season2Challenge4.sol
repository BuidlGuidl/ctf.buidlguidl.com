//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Season2Challenge4 {
    address public nftContract;

    uint256 public constant EXPECTED_WEI = 1 gwei;
    bool private _paid;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag() external {
        _paid = false;

        (bool ok, ) = msg.sender.call("");
        require(ok, "callback failed");
        require(_paid, "not paid");

        INFTFlags(nftContract).mint(tx.origin, 4);

        _paid = false;
    }

    receive() external payable {
        require(msg.value == EXPECTED_WEI, "bad amount");
        _paid = true;
    }
}

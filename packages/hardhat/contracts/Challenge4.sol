//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge4 {
	address public nftContract;
	address public allowedCaller;

	constructor(address _nftContract, address _allowedCaller) {
		nftContract = _nftContract;
		allowedCaller = _allowedCaller;
	}

	function mintFlag(address _minter) public {
		require(msg.sender == allowedCaller, "Not allowed");
		INFTFlags(nftContract).mint(_minter, 4);
	}
}

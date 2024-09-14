//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge3 {
	address public nftContract;
	mapping(address => uint256) public points;
	uint256 public constant POINTS_TO_MINT = 10;

	constructor(address _nftContract) {
		nftContract = _nftContract;
	}

	function claimPoints() public {
		require(points[tx.origin] == 0, "Already claimed points");
		(bool success, ) = msg.sender.call("");
		require(success, "External call failed");

		points[tx.origin] += 1;
	}

	function mintFlag() public {
		require(points[tx.origin] >= POINTS_TO_MINT, "Not enough points");
		points[tx.origin] -= POINTS_TO_MINT;
		INFTFlags(nftContract).mint(tx.origin, 3);
	}
}

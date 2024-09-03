//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface INFTContract {
	function mint(address _recipient, uint256 _challengeId) external;
}

contract Challenge1 {
	address public nftContract;

	constructor(address _nftContract) {
		nftContract = _nftContract;
	}

	// ToDo. set name (save + emit event so we can index)
	function initializeGame() public {
		INFTContract(nftContract).mint(msg.sender, 1);
	}
}

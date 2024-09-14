//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge1 {
	address public nftContract;
	mapping(address => string) public builderNames;

	event BuilderInit(address indexed player, string name);

	constructor(address _nftContract) {
		nftContract = _nftContract;
	}

	function registerMe(string memory _name) public {
		builderNames[msg.sender] = _name;
		emit BuilderInit(msg.sender, _name);
		INFTFlags(nftContract).mint(msg.sender, 1);
	}
}

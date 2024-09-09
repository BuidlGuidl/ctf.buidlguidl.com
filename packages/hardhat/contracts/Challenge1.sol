//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// TODO: Move to a file so we can import.
interface INFTContract {
	function mint(address _recipient, uint256 _challengeId) external;
}

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
		INFTContract(nftContract).mint(msg.sender, 1);
	}
}

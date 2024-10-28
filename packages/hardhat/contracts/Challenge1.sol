//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Challenge1 {
    address public nftContract;

    struct TeamInfo {
        string name;
        uint8 teamSize;
    }

    mapping(address => TeamInfo) public teamInfo;

    event TeamInit(address indexed team, string name, uint8 teamSize);

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function registerTeam(string memory _name, uint8 _teamSize) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_teamSize > 0 && _teamSize <= 4, "Team size must be between 1 and 4");

        teamInfo[msg.sender] = TeamInfo(_name, _teamSize);
        emit TeamInit(msg.sender, _name, _teamSize);
        INFTFlags(nftContract).mint(msg.sender, 1);
    }
}

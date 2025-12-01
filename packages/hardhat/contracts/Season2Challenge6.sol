//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./INFTFlags.sol";

contract Season2Challenge6 {
    address public nftContract;
    mapping(address => uint8) public points;
    mapping(address => uint8) public levels;
    uint8 public constant POINTS_TO_UPGRADE = 10;
    uint8 public constant MIN_POWER_TO_MINT = 30;
    uint8 public constant KEY_VALUE = 32;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function resetPoints() public {
        points[tx.origin] = 0;
    }

    function claimPoints() public {
        require(points[tx.origin] == 0, "Already claimed points");
        (bool success, ) = msg.sender.call("");
        require(success, "External call failed");

        points[tx.origin] += 1;
    }

    function upgradeLevel() public {
        require(points[tx.origin] >= POINTS_TO_UPGRADE, "Not enough points");
        points[tx.origin] -= POINTS_TO_UPGRADE;
        levels[tx.origin] += 1;
    }

    function mintFlag() public {
        require(points[tx.origin] < POINTS_TO_UPGRADE, "Upgrade first");
        require(points[tx.origin] * levels[tx.origin] >= MIN_POWER_TO_MINT, "Not enough powner to mint");
        uint8 key = points[tx.origin] << levels[tx.origin];
        require(key == KEY_VALUE, "Wrong key value");
        INFTFlags(nftContract).mint(tx.origin, 6);
    }
}

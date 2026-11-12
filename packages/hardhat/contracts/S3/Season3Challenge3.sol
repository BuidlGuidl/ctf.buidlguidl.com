//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

interface ISeason3Challenge3Solution {
    function accessKey() external view returns (bytes32);
}

contract Season3Challenge3 {
    address public nftContract;
    bytes32 public constant FIRST_KEY = keccak256("LET_ME_IN");
    mapping(address => bool) public probing;
    mapping(address => address) public solverOwner;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag() external {
        require(msg.sender != tx.origin, "Must call from contract");
        _bindSolver();

        probing[tx.origin] = false;
        require(ISeason3Challenge3Solution(msg.sender).accessKey{ gas: 30000 }() == FIRST_KEY, "Wrong first key");

        probing[tx.origin] = true;
        require(
            ISeason3Challenge3Solution(msg.sender).accessKey{ gas: 30000 }() ==
                keccak256(abi.encodePacked(msg.sender, tx.origin, address(this))),
            "Wrong second key"
        );

        probing[tx.origin] = false;
        INFTFlags(nftContract).mint(tx.origin, 3);
    }

    function _bindSolver() private {
        address owner = solverOwner[msg.sender];
        if (owner == address(0)) {
            solverOwner[msg.sender] = tx.origin;
        } else {
            require(owner == tx.origin, "Solver bound to another agent");
        }
    }
}

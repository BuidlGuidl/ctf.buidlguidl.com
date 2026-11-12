//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season3Challenge4 {
    address public nftContract;

    uint8 public constant TARGET_LEVEL = 5;
    uint8 public constant KEY_VALUE = 64;
    uint8 public constant MIN_POWER = 150;

    mapping(address => bool) public active;
    mapping(address => uint8) public levels;
    mapping(address => uint256) public paid;
    mapping(address => address) public solverOwner;
    mapping(address => address) public sessionSolver;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag(uint8 power) external {
        require(msg.sender != tx.origin, "Must call from contract");
        _bindSolver();

        active[tx.origin] = true;
        levels[tx.origin] = 0;
        paid[tx.origin] = 0;
        sessionSolver[tx.origin] = msg.sender;

        (bool ok, ) = msg.sender.call("");
        require(ok, "callback failed");

        active[tx.origin] = false;

        uint8 level = levels[tx.origin];
        require(level == TARGET_LEVEL, "Wrong level");
        require(paid[tx.origin] == uint256(TARGET_LEVEL) * 1 gwei, "Wrong total paid");
        require(power * level >= MIN_POWER, "Not enough power");
        require(power << level == KEY_VALUE, "Wrong key value");

        INFTFlags(nftContract).mint(tx.origin, 4);
    }

    function climb() external payable {
        require(active[tx.origin], "No active session");
        require(msg.sender == sessionSolver[tx.origin], "Wrong solver");
        require(msg.value == (uint256(levels[tx.origin]) + 1) * 1 gwei, "Wrong payment");
        paid[tx.origin] += msg.value;

        (bool ok, ) = msg.sender.call("");
        require(ok, "callback failed");

        levels[tx.origin] += 1;
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

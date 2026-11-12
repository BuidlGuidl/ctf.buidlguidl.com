// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season3Challenge7 {
    uint256 public constant DEFAULT_DELAY = 7 days;
    uint256 public constant MAX_DELAY = 14 days;

    address public nftContract;

    mapping(address => mapping(address => bool)) public proposers;
    mapping(address => mapping(bytes32 => uint256)) public readyAt;
    mapping(address => uint256) private _delays;
    mapping(address => bool) private _delaySet;
    mapping(address => address) public solverOwner;

    event OperationScheduled(address indexed player, bytes32 indexed id, uint256 readyAt);
    event OperationExecuted(address indexed player, bytes32 indexed id);

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    modifier onlySelf() {
        require(msg.sender == address(this), "Only the timelock itself");
        _;
    }

    function delayOf(address player) public view returns (uint256) {
        return _delaySet[player] ? _delays[player] : DEFAULT_DELAY;
    }

    function getOperationId(
        address[] calldata targets,
        bytes[] calldata dataElements,
        bytes32 salt
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(targets, dataElements, salt));
    }

    function schedule(address[] calldata targets, bytes[] calldata dataElements, bytes32 salt) external {
        _bindSolver();
        require(proposers[tx.origin][msg.sender], "Not a proposer");
        require(targets.length > 0 && targets.length == dataElements.length, "Bad operation");

        bytes32 id = getOperationId(targets, dataElements, salt);
        require(readyAt[tx.origin][id] == 0, "Already scheduled");

        uint256 ready = block.timestamp + delayOf(tx.origin);
        readyAt[tx.origin][id] = ready;
        emit OperationScheduled(tx.origin, id, ready);
    }

    function execute(address[] calldata targets, bytes[] calldata dataElements, bytes32 salt) external {
        _bindSolver();
        require(targets.length > 0 && targets.length == dataElements.length, "Bad operation");

        bytes32 id = getOperationId(targets, dataElements, salt);

        for (uint256 i = 0; i < targets.length; i++) {
            require(targets[i] != nftContract, "Forbidden target");
            (bool success, bytes memory result) = targets[i].call(dataElements[i]);
            if (!success) {
                assembly {
                    revert(add(result, 0x20), mload(result))
                }
            }
        }

        uint256 ready = readyAt[tx.origin][id];
        require(ready != 0, "Operation not scheduled");
        require(block.timestamp >= ready, "Operation not ready");

        readyAt[tx.origin][id] = type(uint256).max;
        emit OperationExecuted(tx.origin, id);
    }

    function grantProposer(address account) external onlySelf {
        proposers[tx.origin][account] = true;
    }

    function updateDelay(uint64 newDelay) external onlySelf {
        require(newDelay <= MAX_DELAY, "Delay too long");
        _delays[tx.origin] = newDelay;
        _delaySet[tx.origin] = true;
    }

    function mintFlag() external onlySelf {
        require(delayOf(tx.origin) >= 1 hours, "Delay too short");
        require(msg.data.length == 0x24, "Wrong calldata length");

        uint256 player;
        assembly {
            player := calldataload(0x04)
        }
        require(player == uint256(uint160(tx.origin)), "Wrong player");

        INFTFlags(nftContract).mint(tx.origin, 7);
    }

    function _bindSolver() private {
        if (msg.sender == tx.origin || msg.sender == address(this)) return;
        address owner = solverOwner[msg.sender];
        if (owner == address(0)) {
            solverOwner[msg.sender] = tx.origin;
        } else {
            require(owner == tx.origin, "Solver bound to another agent");
        }
    }
}

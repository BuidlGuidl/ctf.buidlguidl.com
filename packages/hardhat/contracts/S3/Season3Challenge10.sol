// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Season3Challenge10 {
    uint256 public constant MAX_CODE_SIZE = 40;
    uint256 public constant RANDOM_ROUNDS = 8;
    uint256 public constant GAS_PER_CALL = 60_000;

    address public nftContract;

    mapping(bytes32 => bool) public usedCodehashes;
    mapping(address => bytes32) public commitments;
    mapping(address => uint256) public committedAt;

    event SolverGraded(address indexed player, address indexed solver);

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function commitmentFor(address player, bytes32 initCodeHash) public pure returns (bytes32) {
        return keccak256(abi.encode(player, initCodeHash));
    }

    function commit(bytes32 commitment) external {
        commitments[tx.origin] = commitment;
        committedAt[tx.origin] = block.number;
    }

    function mintFlag(bytes memory initCode, bytes32 salt) external {
        require(commitments[tx.origin] == commitmentFor(tx.origin, keccak256(initCode)), "Init code not committed");
        require(block.number > committedAt[tx.origin], "Commit too recent");

        address solver;
        bytes32 finalSalt = keccak256(abi.encodePacked(tx.origin, salt));
        assembly {
            solver := create2(0, add(initCode, 0x20), mload(initCode), finalSalt)
        }
        require(solver != address(0), "Deployment failed");

        bytes memory code = solver.code;
        require(code.length > 0 && code.length <= MAX_CODE_SIZE, "Wrong code size");
        _requireSelfContained(code);

        bytes32 codehash = solver.codehash;
        require(!usedCodehashes[codehash], "Solver already used");
        usedCodehashes[codehash] = true;

        _check(solver, 0);
        _check(solver, 1);
        _check(solver, 2);
        _check(solver, 3);
        _check(solver, type(uint256).max);

        bytes32 seed = keccak256(abi.encodePacked(block.prevrandao, blockhash(block.number - 1), tx.origin, gasleft()));
        for (uint256 i = 0; i < RANDOM_ROUNDS; i++) {
            seed = keccak256(abi.encodePacked(seed, i));
            _check(solver, uint256(seed) >> uint8(seed[0]));
        }

        emit SolverGraded(tx.origin, solver);
        INFTFlags(nftContract).mint(tx.origin, 10);
    }

    function _requireSelfContained(bytes memory code) private pure {
        for (uint256 i = 0; i < code.length; i++) {
            uint8 op = uint8(code[i]);
            require(
                op != 0x3b &&
                    op != 0x3c &&
                    op != 0x3f &&
                    op != 0x54 &&
                    op != 0x5c &&
                    op != 0xf0 &&
                    op != 0xf1 &&
                    op != 0xf2 &&
                    op != 0xf4 &&
                    op != 0xf5 &&
                    op != 0xfa &&
                    op != 0xff,
                "Forbidden opcode"
            );
            if (op >= 0x60 && op <= 0x7f) {
                i += op - 0x5f;
            }
        }
    }

    function _check(address solver, uint256 input) private view {
        (bool success, bytes memory result) = solver.staticcall{ gas: GAS_PER_CALL }(abi.encode(input));
        require(success && result.length == 32, "Solver failed");
        require(abi.decode(result, (uint256)) == Math.sqrt(input), "Wrong answer");
    }
}

//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISeason3Challenge6Borrower {
    function onFlashLoan(address initiator, uint256 amount, bytes calldata data) external returns (bytes32);
}

contract Season3Challenge6Token is ERC20, EIP712, ERC20Votes {
    constructor(address treasury, address reserve) ERC20("Challenge6 Governance", "C6GOV") EIP712("C6GOV", "1") {
        _mint(treasury, 600_000 ether);
        _mint(reserve, 400_000 ether);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }
}

contract Season3Challenge6Reserve {
    function delegateTo(Season3Challenge6Token token) external {
        require(token.delegates(address(this)) == address(0), "Already delegated");
        token.delegate(address(this));
    }
}

contract Season3Challenge6Pool is ReentrancyGuard {
    bytes32 public constant CALLBACK_SUCCESS = keccak256("Challenge6Borrower.onFlashLoan");

    Season3Challenge6Token public immutable token;
    Season3Challenge6Reserve public immutable reserve;

    constructor() {
        reserve = new Season3Challenge6Reserve();
        token = new Season3Challenge6Token(address(this), address(reserve));
        reserve.delegateTo(token);
    }

    function maxFlashLoan() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function flashLoan(ISeason3Challenge6Borrower receiver, uint256 amount, bytes calldata data) external nonReentrant {
        uint256 balanceBefore = maxFlashLoan();
        require(amount <= balanceBefore, "Not enough liquidity");

        token.transfer(address(receiver), amount);
        require(
            receiver.onFlashLoan(msg.sender, amount, data) == CALLBACK_SUCCESS,
            "Callback failed"
        );
        token.transferFrom(address(receiver), address(this), amount);

        require(maxFlashLoan() >= balanceBefore, "Flash loan not repaid");
    }
}

contract Season3Challenge6 {
    struct Action {
        address proposer;
        address target;
        bytes data;
        uint64 proposedAt;
        uint64 executedAt;
    }

    uint256 public constant ACTION_DELAY = 5 minutes;

    address public nftContract;
    Season3Challenge6Token public token;
    Season3Challenge6Pool public pool;

    uint256 public actionCounter;
    mapping(uint256 => Action) public actions;
    mapping(address => address) public solverOwner;

    event ActionQueued(uint256 indexed actionId, address indexed proposer, address indexed target);
    event ActionExecuted(uint256 indexed actionId, address indexed executor);

    constructor(address _nftContract, Season3Challenge6Pool _pool) {
        nftContract = _nftContract;
        token = _pool.token();
        pool = _pool;
    }

    modifier onlyGovernance() {
        require(msg.sender == address(this), "Only governance");
        _;
    }

    function queueAction(address target, bytes calldata data) external returns (uint256 actionId) {
        _bindSolver();
        require(target != nftContract && target != address(token) && target != address(pool), "Forbidden target");
        require(token.getVotes(msg.sender) > token.totalSupply() / 2, "Not enough votes");

        actionId = ++actionCounter;
        actions[actionId] = Action({
            proposer: tx.origin,
            target: target,
            data: data,
            proposedAt: uint64(block.timestamp),
            executedAt: 0
        });

        emit ActionQueued(actionId, tx.origin, target);
    }

    function executeAction(uint256 actionId) external {
        Action storage action = actions[actionId];
        require(action.proposedAt != 0, "Unknown action");
        require(action.executedAt == 0, "Already executed");
        require(block.timestamp >= action.proposedAt + ACTION_DELAY, "Too early");
        require(action.proposer == tx.origin, "Not the proposer");

        action.executedAt = uint64(block.timestamp);
        (bool success, ) = action.target.call(action.data);
        require(success, "Action failed");

        emit ActionExecuted(actionId, msg.sender);
    }

    function grantFlag() external onlyGovernance {
        INFTFlags(nftContract).mint(tx.origin, 6);
    }

    function _bindSolver() private {
        if (msg.sender == tx.origin) return;
        address owner = solverOwner[msg.sender];
        if (owner == address(0)) {
            solverOwner[msg.sender] = tx.origin;
        } else {
            require(owner == tx.origin, "Solver bound to another agent");
        }
    }
}

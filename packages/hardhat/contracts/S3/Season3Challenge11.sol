// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

interface ISeason3Challenge11Ledger {
    function nftContract() external view returns (address);

    function heldOf(address account) external view returns (uint256);

    function debitHeld(address account, uint256 amount) external;

    function swapCreditLock(uint256 value) external returns (uint256 previous);
}

contract Season3Challenge11Wallet {
    address public owner;
    uint256 public maxBalance;
    mapping(address => bool) public whitelisted;
    mapping(address => uint256) public balances;

    modifier onlyWhitelisted() {
        require(whitelisted[msg.sender], "Not whitelisted");
        _;
    }

    function setMaxBalance(uint256 _maxBalance) external onlyWhitelisted {
        require(ISeason3Challenge11Ledger(address(this)).heldOf(msg.sender) == 0, "Withdraw your funds first");
        maxBalance = _maxBalance;
    }

    function addToWhitelist(address addr) external {
        require(msg.sender == owner, "Not the owner");
        whitelisted[addr] = true;
    }

    function deposit() external payable onlyWhitelisted {
        balances[msg.sender] += msg.value;
    }

    function execute(address to, uint256 value, bytes calldata data) external payable onlyWhitelisted {
        ISeason3Challenge11Ledger ledger = ISeason3Challenge11Ledger(address(this));
        require(to != address(this) && to != ledger.nftContract(), "Forbidden target");
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        ledger.debitHeld(msg.sender, value);
        uint256 previousLock = ledger.swapCreditLock(0);
        (bool success, ) = to.call{ value: value }(data);
        ledger.swapCreditLock(previousLock);
        require(success, "Execution failed");
    }

    function multicall(bytes[] calldata data) external payable onlyWhitelisted {
        bool depositCalled = false;
        for (uint256 i = 0; i < data.length; i++) {
            bytes memory _data = data[i];
            bytes4 selector;
            assembly {
                selector := mload(add(_data, 32))
            }
            if (selector == this.deposit.selector) {
                require(!depositCalled, "Deposit can only be called once");
                depositCalled = true;
            }
            (bool success, ) = address(this).delegatecall(data[i]);
            require(success, "Error while delegating call");
        }
    }
}

contract Season3Challenge11 {
    bytes32 private constant LOCK_SLOT = keccak256("challenge11.proxy.lock");
    bytes32 private constant HELD_SLOT = keccak256("challenge11.proxy.held");
    bytes32 private constant SOLVER_SLOT = keccak256("challenge11.proxy.solver");

    address public pendingAdmin;
    address public admin;
    address public immutable implementation;
    address public immutable nftContract;

    constructor(address _nftContract, address _implementation) {
        nftContract = _nftContract;
        implementation = _implementation;
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not the admin");
        _;
    }

    function proposeNewAdmin(address _newAdmin) external {
        pendingAdmin = _newAdmin;
    }

    function approveNewAdmin(address _expectedAdmin) external onlyAdmin {
        require(pendingAdmin == _expectedAdmin, "Expected new admin by the current admin is not the pending admin");
        admin = pendingAdmin;
    }

    function heldOf(address account) public view returns (uint256 amount) {
        bytes32 slot = _heldSlot(account);
        assembly {
            amount := sload(slot)
        }
    }

    function debitHeld(address account, uint256 amount) external {
        require(msg.sender == address(this), "Only the wallet");
        uint256 current = heldOf(account);
        require(current >= amount, "Insufficient funds");
        _setHeld(account, current - amount);
    }

    function swapCreditLock(uint256 value) external returns (uint256 previous) {
        require(msg.sender == address(this), "Only the wallet");
        bytes32 lockSlot = LOCK_SLOT;
        assembly {
            previous := sload(lockSlot)
            sstore(lockSlot, value)
        }
    }

    function solverOwner(address account) public view returns (address owner) {
        bytes32 slot = keccak256(abi.encode(account, SOLVER_SLOT));
        assembly {
            owner := sload(slot)
        }
    }

    function mintFlag() external onlyAdmin {
        _bindSolver();
        require(Season3Challenge11Wallet(payable(address(this))).balances(msg.sender) > 0, "No balance");
        require(heldOf(msg.sender) == 0, "Funds still held");
        INFTFlags(nftContract).mint(tx.origin, 11);
    }

    function _bindSolver() private {
        if (msg.sender == tx.origin) return;
        address owner = solverOwner(msg.sender);
        if (owner == address(0)) {
            bytes32 slot = keccak256(abi.encode(msg.sender, SOLVER_SLOT));
            address agent = tx.origin;
            assembly {
                sstore(slot, agent)
            }
        } else {
            require(owner == tx.origin, "Solver bound to another agent");
        }
    }

    fallback() external payable {
        _delegate();
    }

    receive() external payable {
        _delegate();
    }

    function _delegate() private {
        bytes32 lockSlot = LOCK_SLOT;
        uint256 locked;
        assembly {
            locked := sload(lockSlot)
        }

        bool credit = msg.value > 0 && locked == 0;
        if (credit) {
            assembly {
                sstore(lockSlot, 1)
            }
            _setHeld(msg.sender, heldOf(msg.sender) + msg.value);
        }

        (bool success, bytes memory result) = implementation.delegatecall(msg.data);

        if (credit) {
            assembly {
                sstore(lockSlot, 0)
            }
        }

        assembly {
            switch success
            case 0 {
                revert(add(result, 0x20), mload(result))
            }
            default {
                return(add(result, 0x20), mload(result))
            }
        }
    }

    function _heldSlot(address account) private pure returns (bytes32) {
        return keccak256(abi.encode(account, HELD_SLOT));
    }

    function _setHeld(address account, uint256 amount) private {
        bytes32 slot = _heldSlot(account);
        assembly {
            sstore(slot, amount)
        }
    }
}

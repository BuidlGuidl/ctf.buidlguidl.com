//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season3Challenge9 {
    address public nftContract;
    address public immutable signer;

    mapping(bytes32 => bool) public usedDigests;
    mapping(address => bool) public redeemed;
    mapping(address => bytes32) public commitments;
    mapping(address => uint256) public committedAt;

    event VoucherIssued(address indexed recipient, bytes32 digest, uint8 v, bytes32 r, bytes32 s);
    event VoucherRedeemed(address indexed recipient, bytes32 indexed digest);

    constructor(address _nftContract, address _signer, address _recipient, uint8 v, bytes32 r, bytes32 s) {
        nftContract = _nftContract;
        signer = _signer;

        bytes32 digest = voucherDigest(_recipient);
        require(ecrecover(digest, v, r, s) == _signer, "Invalid voucher");
        usedDigests[digest] = true;
        redeemed[_recipient] = true;
        emit VoucherIssued(_recipient, digest, v, r, s);
    }

    function voucherDigest(address recipient) public view returns (bytes32) {
        return keccak256(abi.encodePacked("BG CTF VOUCHER", block.chainid, address(this), recipient));
    }

    function redeem(uint8 v, bytes32 r, bytes32 s) external {
        _redeem(voucherDigest(tx.origin), v, r, s);
    }

    function commitmentFor(address recipient, bytes32 digest) public pure returns (bytes32) {
        return keccak256(abi.encode(recipient, digest));
    }

    function commit(bytes32 commitment) external {
        commitments[tx.origin] = commitment;
        committedAt[tx.origin] = block.number;
    }

    function redeemPrehashed(bytes32 digest, uint8 v, bytes32 r, bytes32 s) external {
        require(commitments[tx.origin] == commitmentFor(tx.origin, digest), "Digest not committed");
        require(block.number > committedAt[tx.origin], "Commit too recent");
        _redeem(digest, v, r, s);
    }

    function _redeem(bytes32 digest, uint8 v, bytes32 r, bytes32 s) private {
        require(!redeemed[tx.origin], "Already redeemed");
        require(!usedDigests[digest], "Voucher already used");
        require(ecrecover(digest, v, r, s) == signer, "Invalid signature");

        usedDigests[digest] = true;
        redeemed[tx.origin] = true;
        emit VoucherRedeemed(tx.origin, digest);
        INFTFlags(nftContract).mint(tx.origin, 9);
    }
}

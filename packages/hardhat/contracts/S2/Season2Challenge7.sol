// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "../INFTFlags.sol";

contract Season2Challenge7 {
    address public nftContract;
    bytes4 public mintFlagSelector = bytes4(keccak256("mintFlag()"));
    mapping(address => bool) public minters;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    modifier onlyChallenge7() {
        require(msg.sender == address(this), "Only the Challenge7 contract can call this");
        _;
    }

    modifier onlyMintFlag() {
        bytes32[1] memory selector;
        assembly {
            calldatacopy(selector, 68, 4)
        }
        require(selector[0] == mintFlagSelector, "Can only call the mintFlag function");
        _;
    }

    function mint(bytes memory _data) public onlyMintFlag {
        (bool success, ) = address(this).call(_data);
        require(success, "call failed :(");
    }

    function allowMinter() public onlyChallenge7 {
        minters[tx.origin] = true;
    }

    function mintFlag() public onlyChallenge7 {
        require(minters[tx.origin], "Not allowed to mint");
        INFTFlags(nftContract).mint(tx.origin, 7);
    }
}

//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./INFTFlags.sol";

interface IContract13Solution {
    function name() external view returns (string memory);
}

contract Challenge13 {
    using Strings for uint256;

    address public nftContract;
    uint256 public count;

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function mintFlag(uint256 code) public {
        require(code == count << 8, "Wrong code");
        require(
            keccak256(
                abi.encodePacked(IContract13Solution(msg.sender).name())
            ) == keccak256("BG CTF Challenge 13 Solution"),
            "Wrong name"
        );
        uint256 gas = gasleft();
        require(
            gas > 190_000 && gas < 200_000,
            string.concat("Wrong gas: ", gas.toString())
        );

        INFTFlags(nftContract).mint(tx.origin, 13);
        count += 1;
    }
}

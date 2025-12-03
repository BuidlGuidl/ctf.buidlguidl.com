//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface INFTFlags {
    function mint(address _recipient, uint256 _challengeId) external;

    function hasMinted(address _recipient, uint256 _challengeId) external view returns (bool);

    function tokenIdCounter() external view returns (uint256);
}

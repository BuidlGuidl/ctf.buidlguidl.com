//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/NFTFlags.sol";
import "../contracts/Challenge1.sol";
import "../contracts/Challenge2.sol";
import "../contracts/Challenge3.sol";
import "../contracts/Challenge4.sol";
import "../contracts/Challenge5.sol";
import "../contracts/Challenge6.sol";
import "../contracts/Challenge7.sol";
import "../contracts/Challenge7Delegate.sol";
import "../contracts/Challenge8.sol";
import "../contracts/Challenge9.sol";
import "../contracts/Challenge11.sol";
import "../contracts/Challenge12.sol";
import "./DeployHelpers.s.sol";

/**
 * @notice Deploy script for all the challenges contract
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeployChallenges.s.sol  # local anvil chain
 */
contract DeployChallenges is ScaffoldETHDeploy {
    /**
     * @dev Deployer setup based on `ETH_KEYSTORE_ACCOUNT` in `.env`:
     *      - "scaffold-eth-default": Uses Anvil's account #9 (0xa0Ee7A142d267C1f36714E4a8F75612F20a79720), no password prompt
     *      - "scaffold-eth-custom": requires password used while creating keystore
     *
     * Note: Must use ScaffoldEthDeployerRunner modifier to:
     *      - Setup correct `deployer` account and funds it
     *      - Export contract addresses & ABIs to nextjs & scripts packages
     */
    function run() external ScaffoldEthDeployerRunner {
        // Deploy NFTFlags
        NFTFlags nftFlags = new NFTFlags(deployer);
        console.log("NFT Flag contract deployed at", address(nftFlags));
        nftFlags.enable();

        // Deploy Challenge1
        Challenge1 challenge1 = new Challenge1(address(nftFlags));
        console.log("Challenge #1 deployed at", address(challenge1));

        // Deploy Challenge2
        Challenge2 challenge2 = new Challenge2(address(nftFlags));
        console.log("Challenge #2 deployed at", address(challenge2));

        // Deploy Challenge3
        Challenge3 challenge3 = new Challenge3(address(nftFlags));
        console.log("Challenge #3 deployed at", address(challenge3));

        // Deploy Challenge4
        Challenge4 challenge4 = new Challenge4(address(nftFlags));
        console.log("Challenge #4 deployed at", address(challenge4));
        string memory hardhatMnemonic = "test test test test test test test test test test test junk";
        uint256 challenge4AccountPrivateKey = vm.deriveKey(hardhatMnemonic, 12);
        address challenge4AccountAddress = vm.addr(challenge4AccountPrivateKey);
        challenge4.addMinter(challenge4AccountAddress);

        // Deploy Challenge5
        Challenge5 challenge5 = new Challenge5(address(nftFlags));
        console.log("Challenge #5 deployed at", address(challenge5));

        // Deploy Challenge6
        Challenge6 challenge6 = new Challenge6(address(nftFlags));
        console.log("Challenge #6 deployed at", address(challenge6));

        // Deploy Challenge7Delegate and Challenge7
        Challenge7Delegate challenge7Delegate = new Challenge7Delegate(deployer);
        Challenge7 challenge7 = new Challenge7(address(nftFlags), address(challenge7Delegate), deployer);
        console.log("Challenge #7 deployed at", address(challenge7));

        // Deploy Challenge8
        bytes memory BYTECODE_BASE =
            hex"608060405234801561001057600080fd5b5060405161022c38038061022c83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b610199806100936000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80638fd628f01461003b578063d56d229d14610050575b600080fd5b61004e610049366004610133565b61007f565b005b600054610063906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6001600160a01b03811633146100cc5760405162461bcd60e51b815260206004820152600e60248201526d24b73b30b634b21036b4b73a32b960911b604482015260640160405180910390fd5b6000546040516340c10f1960e01b8152336004820152600860248201526001600160a01b03909116906340c10f1990604401600060405180830381600087803b15801561011857600080fd5b505af115801561012c573d6000803e3d6000fd5b5050505050565b60006020828403121561014557600080fd5b81356001600160a01b038116811461015c57600080fd5b939250505056fea26469706673582212202574d345d5aad3eba6e8e8374fb2634c736f99936431d51dd35a55f1503ef1c764736f6c63430008140033";
        bytes memory fullBytecode = abi.encodePacked(BYTECODE_BASE, abi.encode(address(nftFlags)));
        address challenge8Address;
        assembly {
            challenge8Address := create(0, add(fullBytecode, 0x20), mload(fullBytecode))
            if iszero(challenge8Address) { revert(0, 0) }
        }
        console.log("Challenge #8 deployed at", challenge8Address);

        // Deploy Challenge9
        bytes32 randomBytes = keccak256(abi.encodePacked(block.timestamp, block.prevrandao));
        Challenge9 challenge9 = new Challenge9(address(nftFlags), randomBytes);
        console.log("Challenge #9 deployed at", address(challenge9));

        // :: Challenge 10 ::
        // No contract to deploy for this one. Check the NFTFlag contract.

        // Deploy Challenge11
        Challenge11 challenge11 = new Challenge11(address(nftFlags));
        console.log("Challenge #11 deployed at", address(challenge11));

        // Deploy Challenge12
        Challenge12 challenge12 = new Challenge12(address(nftFlags));
        console.log("Challenge #12 deployed at", address(challenge12));

        // Set addAllowedMinterMultiple in NFTFlags
        address[] memory challengeAddresses = new address[](11);
        challengeAddresses[0] = address(challenge1);
        challengeAddresses[1] = address(challenge2);
        challengeAddresses[2] = address(challenge3);
        challengeAddresses[3] = address(challenge4);
        challengeAddresses[4] = address(challenge5);
        challengeAddresses[5] = address(challenge6);
        challengeAddresses[6] = address(challenge7);
        challengeAddresses[7] = challenge8Address;
        challengeAddresses[8] = address(challenge9);
        challengeAddresses[9] = address(challenge11);
        challengeAddresses[10] = address(challenge12);

        nftFlags.addAllowedMinterMultiple(challengeAddresses);
        console.log("Added allowed minters to NFTFlags");
    }
}

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/S2/Season2NFTFlags.sol";
import "../contracts/S2/Season2Challenge12.sol";
import "../contracts/S2/Season2Challenge12HeroNFT.sol";
import "../contracts/S2/Season2Challenge12GoldToken.sol";
import "../contracts/S2/Season2Challenge12Inventory.sol";
import "../contracts/S2/Season2Challenge12Quest.sol";
import "../contracts/S2/Season2Challenge12Dungeon.sol";
import "../contracts/S2/Season2Challenge12Victory.sol";
import "./DeployHelpers.s.sol";
import "forge-std/StdJson.sol";

/**
 * @notice Deploy script for Season2 Challenge12 contracts
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeploySeason2Challenge12.s.sol  # local anvil chain
 */
contract DeploySeason2Challenge12 is ScaffoldETHDeploy {
    using stdJson for string;

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
        // Load NFTFlags address from broadcast JSON of DeploySeason2Challenges.s.sol
        string memory root = vm.projectRoot();
        string memory chainIdStr = vm.toString(block.chainid);
        string memory path = string.concat(
            root,
            "/broadcast/DeploySeason2Challenges.s.sol/",
            chainIdStr,
            "/run-latest.json"
        );
        string memory json = vm.readFile(path);
        address nftFlagsAddr = json.readAddress(
            ".transactions[0].contractAddress"
        );
        Season2NFTFlags nftFlags = Season2NFTFlags(nftFlagsAddr);
        console.log("Using NFTFlags at", nftFlagsAddr);

        // Deploy Challenge12
        Season2Challenge12Inventory challenge12Inventory = new Season2Challenge12Inventory();
        console.log(
            "Challenge12Inventory deployed at",
            address(challenge12Inventory)
        );

        Season2Challenge12Quest challenge12Quest = new Season2Challenge12Quest();
        console.log("Challenge12Quest deployed at", address(challenge12Quest));

        Season2Challenge12Dungeon challenge12Dungeon = new Season2Challenge12Dungeon(
                address(challenge12Quest)
            );
        console.log(
            "Challenge12Dungeon deployed at",
            address(challenge12Dungeon)
        );

        Season2Challenge12Victory challenge12Victory = new Season2Challenge12Victory(
                address(challenge12Dungeon)
            );
        console.log(
            "Challenge12Victory deployed at",
            address(challenge12Victory)
        );

        Season2Challenge12HeroNFT challenge12HeroNFT = new Season2Challenge12HeroNFT();
        console.log(
            "Challenge12HeroNFT deployed at",
            address(challenge12HeroNFT)
        );

        Season2Challenge12GoldToken challenge12GoldToken = new Season2Challenge12GoldToken(
                address(challenge12HeroNFT),
                address(challenge12Dungeon),
                address(nftFlags)
            );
        console.log(
            "Challenge12GoldToken deployed at",
            address(challenge12GoldToken)
        );

        Season2Challenge12 challenge12 = new Season2Challenge12(
            address(nftFlags),
            address(challenge12Inventory),
            address(challenge12Quest),
            address(challenge12Dungeon),
            address(challenge12Victory),
            address(challenge12GoldToken),
            address(challenge12HeroNFT)
        );
        console.log("Challenge #12 deployed at", address(challenge12));

        challenge12Inventory.transferOwnership(address(challenge12));
        console.log(
            "Transferred Challenge12Inventory ownership to Challenge12"
        );

        nftFlags.addAllowedMinter(address(challenge12));
        console.log("Added Challenge12 as allowed minter to NFTFlags");

        // Wire gold token into NFTFlags
        nftFlags.setGoldTokenAddress(address(challenge12GoldToken));
        console.log("Set gold token address in NFTFlags");
    }
}

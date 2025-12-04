//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../contracts/S1/Season1NFTFlags.sol";
import "../contracts/S2/Season2NFTFlags.sol";
import "../contracts/S2/Season2Challenge2.sol";
import "../contracts/S2/Season2Challenge3.sol";
import "../contracts/S2/Season2Challenge4.sol";
import "../contracts/S2/Season2Challenge5.sol";
import "../contracts/S2/Season2Challenge6.sol";
import "../contracts/S2/Season2Challenge7.sol";
import "../contracts/S2/Season2Challenge8.sol";
import "../contracts/S2/Season2Challenge9.sol";
import "../contracts/S2/Season2Challenge10.sol";
import "../contracts/S2/Season2Challenge11.sol";
import "./DeployHelpers.s.sol";
import "forge-std/StdJson.sol";

/**
 * @notice Deploy script for all the Season2 challenges contracts (except Challenge12)
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeploySeason2Challenges.s.sol  # local anvil chain
 */
contract DeploySeason2Challenges is ScaffoldETHDeploy {
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
        // NFTFlags contract for Season 1 deployed to Optimism Mainnet
        address season1NftFlagsAddress = 0xc1Ebd7a78FE7c075035c516B916A7FB3f33c26cE;
        if (block.chainid == 10) {
            // Load NFTFlags address from broadcast JSON of DeploySeason1Challenges.s.sol
            string memory root = vm.projectRoot();
            string memory chainIdStr = vm.toString(block.chainid);
            string memory path = string.concat(
                root,
                "/broadcast/DeploySeason1Challenges.s.sol/",
                chainIdStr,
                "/run-latest.json"
            );
            string memory json = vm.readFile(path);
            season1NftFlagsAddress = json.readAddress(
                ".transactions[0].contractAddress"
            );
            console.log("Using Season1NFTFlags at", season1NftFlagsAddress);
        }

        // Deploy NFTFlags
        Season2NFTFlags nftFlags = new Season2NFTFlags(
            deployer,
            season1NftFlagsAddress
        );
        console.log("NFT Flag contract deployed at", address(nftFlags));
        nftFlags.enable();

        // Deploy Challenge2
        Season2Challenge2 challenge2 = new Season2Challenge2(address(nftFlags));
        console.log("Challenge #2 deployed at", address(challenge2));

        // Deploy Challenge3
        Season2Challenge3 challenge3 = new Season2Challenge3(address(nftFlags));
        console.log("Challenge #3 deployed at", address(challenge3));

        // Deploy Challenge4
        Season2Challenge4 challenge4 = new Season2Challenge4(address(nftFlags));
        console.log("Challenge #4 deployed at", address(challenge4));

        // Deploy Challenge5
        Season2Challenge5 challenge5 = new Season2Challenge5(address(nftFlags));
        console.log("Challenge #5 deployed at", address(challenge5));

        // Deploy Challenge6
        Season2Challenge6 challenge6 = new Season2Challenge6(address(nftFlags));
        console.log("Challenge #6 deployed at", address(challenge6));

        // Deploy Challenge7
        Season2Challenge7 challenge7 = new Season2Challenge7(address(nftFlags));
        console.log("Challenge #7 deployed at", address(challenge7));

        // Deploy Challenge8
        bytes32 randomBytes8 = keccak256(
            abi.encodePacked(block.timestamp, block.prevrandao)
        );
        Season2Challenge8 challenge8 = new Season2Challenge8(
            address(nftFlags),
            randomBytes8
        );
        console.log("Challenge #8 deployed at", address(challenge8));

        // Deploy Challenge9
        bytes
            memory BYTECODE_BASE = hex"6080346100c657601f61082038819003918201601f19168301916001600160401b038311848410176100cb578084926020946040528339810103126100c657516001600160a01b0390818116908190036100c65733156100ad5760005460018060a01b0319903382821617600055604051933391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3600154161760015561073e90816100e28239f35b604051631e4fbdf760e01b815260006004820152602490fd5b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604081815260048036101561001557600080fd5b600092833560e01c90816323cfec7e146102cd575080633092afd514610267578063715018a61461020a5780638da5cb5b146101e2578063983b2d5614610179578063aa271e1a1461013b578063d56d229d1461010e5763f2fde38b1461007b57600080fd5b3461010a57602036600319011261010a57610094610570565b9061009d61058b565b6001600160a01b039182169283156100f4575050600054826bffffffffffffffffffffffff60a01b821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8280fd5b50503461013757816003193601126101375760015490516001600160a01b039091168152602090f35b5080fd5b5050346101375760203660031901126101375760209160ff9082906001600160a01b03610166610570565b1681526002855220541690519015158152f35b50503461013757602036600319011261013757610194610570565b61019c61058b565b6001600160a01b03168083526002602052908220805460ff191660011790557f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f68280a280f35b505034610137578160031936011261013757905490516001600160a01b039091168152602090f35b833461026457806003193601126102645761022361058b565b600080546001600160a01b0319811682556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b50503461013757602036600319011261013757610282610570565b61028a61058b565b6001600160a01b03168083526002602052908220805460ff191690557fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb666928280a280f35b90508383346101375780600319360112610137576102e9610570565b9360249384359567ffffffffffffffff918288116104735736602389011215610473578784013583811161055e57601f19603f81601f840116011682018281108582111761054c5786528082523688828b01011161054857958798878299979860209b8c930183860137830101526001600160a01b03918216808852600289528688205490919060ff1615610517578651898101908882526012606082015271424720435446204368616c6c656e6765203960701b608082015233898201526080815260a08101818110878211176105055792610403926103fa9287958c525190207f19457468657265756d205369676e6564204d6573736167653a0a3332000000008c52601c52603c8b206105b7565b90929192610683565b16036104775785965060015416803b1561047357859060448651809881936340c10f1960e01b835233888401526009898401525af1801561046957610446578580f35b84116104585750505281808080808580f35b634e487b7160e01b85526041905283fd5b84513d88823e3d90fd5b8580fd5b845162461bcd60e51b8152808401889052605b818601527f496e76616c6964207369676e61747572652e204d65737361676520746f20736960448201527f676e3a206b656363616b323536286162692e656e636f6465282242472043544660648201527f204368616c6c656e67652039222c206d73672e73656e64657229290000000000608482015260a490fd5b634e487b7160e01b8b5260418852888bfd5b865162461bcd60e51b81528086018a9052600c818801526b2737ba10309036b4b73a32b960a11b6044820152606490fd5b8680fd5b634e487b7160e01b8852604186528888fd5b634e487b7160e01b8752604185528787fd5b600435906001600160a01b038216820361058657565b600080fd5b6000546001600160a01b0316330361059f57565b60405163118cdaa760e01b8152336004820152602490fd5b81519190604183036105e8576105e192506020820151906060604084015193015160001a906105f3565b9192909190565b505060009160029190565b91907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841161067757926020929160ff608095604051948552168484015260408301526060820152600092839182805260015afa1561066b5780516001600160a01b0381161561066257918190565b50809160019190565b604051903d90823e3d90fd5b50505060009160039190565b60048110156106f25780610695575050565b600181036106af5760405163f645eedf60e01b8152600490fd5b600281036106d05760405163fce698f760e01b815260048101839052602490fd5b6003146106da5750565b602490604051906335e2f38360e21b82526004820152fd5b634e487b7160e01b600052602160045260246000fdfea26469706673582212208a8d62709af55243218e869d9c0117e5acbae3aea11fd21188cfc780cbce518064736f6c63430008140033";
        bytes memory fullBytecode = abi.encodePacked(
            BYTECODE_BASE,
            abi.encode(address(nftFlags))
        );
        address challenge9Address;
        assembly {
            challenge9Address := create(
                0,
                add(fullBytecode, 0x20),
                mload(fullBytecode)
            )
            if iszero(challenge9Address) {
                revert(0, 0)
            }
        }
        console.log("Challenge #9 deployed at", challenge9Address);

        string
            memory hardhatMnemonic = "test test test test test test test test test test test junk";
        uint256 challenge9AccountPrivateKey = vm.deriveKey(hardhatMnemonic, 12);
        address challenge9AccountAddress = vm.addr(challenge9AccountPrivateKey);

        bytes4 functionSelector = 0x983b2d56;
        bytes memory encodedParams = abi.encode(challenge9AccountAddress);
        bytes memory callData = abi.encodePacked(
            functionSelector,
            encodedParams
        );
        (bool success, ) = challenge9Address.call(callData);
        require(success, "Challenge 9 post-deploy call failed");
        console.log("Challenge 9 post-deploy call executed");

        // Deploy Challenge10
        Season2Challenge10 challenge10 = new Season2Challenge10(
            address(nftFlags)
        );
        console.log("Challenge #10 deployed at", address(challenge10));

        // Deploy Challenge11
        Season2Challenge11 challenge11 = new Season2Challenge11(
            address(nftFlags)
        );
        console.log("Challenge #11 deployed at", address(challenge11));

        // Set addAllowedMinterMultiple in NFTFlags
        // split into multiple txns to avoid "stack too deep" error
        address[] memory challengeAddresses = new address[](10);
        challengeAddresses[0] = address(challenge2);
        challengeAddresses[1] = address(challenge3);
        challengeAddresses[2] = address(challenge4);
        challengeAddresses[3] = address(challenge5);
        challengeAddresses[4] = address(challenge6);
        challengeAddresses[5] = address(challenge7);
        challengeAddresses[6] = address(challenge8);
        challengeAddresses[7] = challenge9Address;
        challengeAddresses[8] = address(challenge10);
        challengeAddresses[9] = address(challenge11);

        nftFlags.addAllowedMinterMultiple(challengeAddresses);
        console.log("Added allowed minters to NFTFlags");
    }
}

import { HardhatNetworkHDAccountsConfig, HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HDNodeWallet } from "ethers";
import { Contract, Mnemonic } from "ethers";

/**
 * Helper function to wait for a specified number of milliseconds
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DELAY_TIME = 2000; // use 0 on local network

/**
 * Deploys all the needed CTF contracts
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCtfContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, save } = hre.deployments;

  const season1NftFlags = await hre.ethers.getContract<Contract>("NFTFlags", deployer);

  // :: NFT Flags ::
  await deploy("Season2NFTFlags", {
    from: deployer,
    args: [deployer, await season1NftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  const nftFlags = await hre.ethers.getContract<Contract>("Season2NFTFlags", deployer);
  console.log("🚩 Season 2 NFT Flags contract deployed");

  if (hre.network.name === "localhost") {
    await nftFlags.enable();
    await delay(DELAY_TIME);
    console.log("🔓 Minting enabled");
  }

  // :: Challenge 2 ::
  await deploy("Season2Challenge2", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #2 deployed");

  // :: Challenge 3 ::
  await deploy("Season2Challenge3", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #3 deployed");

  // :: Challenge 4 ::
  await deploy("Season2Challenge4", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #4 deployed");

  // :: Challenge 5 ::
  await deploy("Season2Challenge5", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #5 deployed");

  // :: Challenge 6 ::
  await deploy("Season2Challenge6", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #6 deployed");

  // :: Challenge 7 ::
  await deploy("Season2Challenge7", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #7 deployed");

  // :: Challenge 8 ::
  await deploy("Season2Challenge8", {
    from: deployer,
    args: [await nftFlags.getAddress(), hre.ethers.randomBytes(32)],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #8 deployed");

  // :: Challenge 9 ::
  const challenge9BytecodeBase =
    "0x6080346100c657601f61082038819003918201601f19168301916001600160401b038311848410176100cb578084926020946040528339810103126100c657516001600160a01b0390818116908190036100c65733156100ad5760005460018060a01b0319903382821617600055604051933391167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a3600154161760015561073e90816100e28239f35b604051631e4fbdf760e01b815260006004820152602490fd5b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604081815260048036101561001557600080fd5b600092833560e01c90816323cfec7e146102cd575080633092afd514610267578063715018a61461020a5780638da5cb5b146101e2578063983b2d5614610179578063aa271e1a1461013b578063d56d229d1461010e5763f2fde38b1461007b57600080fd5b3461010a57602036600319011261010a57610094610570565b9061009d61058b565b6001600160a01b039182169283156100f4575050600054826bffffffffffffffffffffffff60a01b821617600055167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0600080a380f35b51631e4fbdf760e01b8152908101849052602490fd5b8280fd5b50503461013757816003193601126101375760015490516001600160a01b039091168152602090f35b5080fd5b5050346101375760203660031901126101375760209160ff9082906001600160a01b03610166610570565b1681526002855220541690519015158152f35b50503461013757602036600319011261013757610194610570565b61019c61058b565b6001600160a01b03168083526002602052908220805460ff191660011790557f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f68280a280f35b505034610137578160031936011261013757905490516001600160a01b039091168152602090f35b833461026457806003193601126102645761022361058b565b600080546001600160a01b0319811682556001600160a01b03167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e08280a380f35b80fd5b50503461013757602036600319011261013757610282610570565b61028a61058b565b6001600160a01b03168083526002602052908220805460ff191690557fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb666928280a280f35b90508383346101375780600319360112610137576102e9610570565b9360249384359567ffffffffffffffff918288116104735736602389011215610473578784013583811161055e57601f19603f81601f840116011682018281108582111761054c5786528082523688828b01011161054857958798878299979860209b8c930183860137830101526001600160a01b03918216808852600289528688205490919060ff1615610517578651898101908882526012606082015271424720435446204368616c6c656e6765203960701b608082015233898201526080815260a08101818110878211176105055792610403926103fa9287958c525190207f19457468657265756d205369676e6564204d6573736167653a0a3332000000008c52601c52603c8b206105b7565b90929192610683565b16036104775785965060015416803b1561047357859060448651809881936340c10f1960e01b835233888401526009898401525af1801561046957610446578580f35b84116104585750505281808080808580f35b634e487b7160e01b85526041905283fd5b84513d88823e3d90fd5b8580fd5b845162461bcd60e51b8152808401889052605b818601527f496e76616c6964207369676e61747572652e204d65737361676520746f20736960448201527f676e3a206b656363616b323536286162692e656e636f6465282242472043544660648201527f204368616c6c656e67652039222c206d73672e73656e64657229290000000000608482015260a490fd5b634e487b7160e01b8b5260418852888bfd5b865162461bcd60e51b81528086018a9052600c818801526b2737ba10309036b4b73a32b960a11b6044820152606490fd5b8680fd5b634e487b7160e01b8852604186528888fd5b634e487b7160e01b8752604185528787fd5b600435906001600160a01b038216820361058657565b600080fd5b6000546001600160a01b0316330361059f57565b60405163118cdaa760e01b8152336004820152602490fd5b81519190604183036105e8576105e192506020820151906060604084015193015160001a906105f3565b9192909190565b505060009160029190565b91907f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841161067757926020929160ff608095604051948552168484015260408301526060820152600092839182805260015afa1561066b5780516001600160a01b0381161561066257918190565b50809160019190565b604051903d90823e3d90fd5b50505060009160039190565b60048110156106f25780610695575050565b600181036106af5760405163f645eedf60e01b8152600490fd5b600281036106d05760405163fce698f760e01b815260048101839052602490fd5b6003146106da5750565b602490604051906335e2f38360e21b82526004820152fd5b634e487b7160e01b600052602160045260246000fdfea26469706673582212208a8d62709af55243218e869d9c0117e5acbae3aea11fd21188cfc780cbce518064736f6c63430008140033";
  const nftFlagsAddress = await nftFlags.getAddress();
  const challenge9Bytecode = challenge9BytecodeBase + nftFlagsAddress.slice(2).padStart(64, "0");
  const deployerSigner = await hre.ethers.getSigner(deployer);
  const nonce = await deployerSigner.getNonce();

  const feeData = await hre.ethers.provider.getFeeData();
  const rawTx = {
    nonce: nonce,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    gasLimit: 800_000,
    to: null,
    value: 0,
    data: challenge9Bytecode,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
  };

  const txResponse = await deployerSigner.sendTransaction(rawTx);
  const txReceipt = await txResponse.wait();
  await delay(DELAY_TIME);
  const challenge9Address = txReceipt?.contractAddress;

  if (challenge9Address) {
    await save("Season2Challenge9", { address: challenge9Address, abi: [] });
    await delay(DELAY_TIME);
  }

  console.log("🚩 Challenge #9 deployed at:", challenge9Address);

  const hAccounts8 = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;
  const derivationPath8 = "m/44'/60'/0'/0/12";
  const challenge9Account = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(hAccounts8.mnemonic), derivationPath8);

  const functionSelector = "0x983b2d56";

  const encodedParams = hre.ethers.AbiCoder.defaultAbiCoder().encode(["address"], [challenge9Account.address]);

  const data = functionSelector + encodedParams.slice(2);

  const txHash = await deployerSigner.sendTransaction({
    to: challenge9Address,
    data,
  });
  await delay(DELAY_TIME);

  console.log("Transaction hash challenge 9 after deploy: ", txHash.hash);

  // :: Challenge 10 ::
  await deploy("Season2Challenge10", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #10 deployed");

  // :: Challenge 11 ::
  await deploy("Season2Challenge11", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #11 deployed");

  // :: Challenge 12 ::
  await deploy("Season2Challenge12Inventory", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  await deploy("Season2Challenge12Quest", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  await deploy("Season2Challenge12Dungeon", {
    from: deployer,
    args: [await (await hre.ethers.getContract<Contract>("Season2Challenge12Quest", deployer)).getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  await deploy("Season2Challenge12Victory", {
    from: deployer,
    args: [await (await hre.ethers.getContract<Contract>("Season2Challenge12Dungeon", deployer)).getAddress()],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  await deploy("Season2Challenge12HeroNFT", {
    from: deployer,
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  await deploy("Season2Challenge12GoldToken", {
    from: deployer,
    args: [
      await (await hre.ethers.getContract<Contract>("Season2Challenge12HeroNFT", deployer)).getAddress(),
      await (await hre.ethers.getContract<Contract>("Season2Challenge12Dungeon", deployer)).getAddress(),
      await nftFlags.getAddress(),
    ],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  const challenge12Inventory = await hre.ethers.getContract<Contract>("Season2Challenge12Inventory", deployer);

  await deploy("Season2Challenge12", {
    from: deployer,
    args: [
      await nftFlags.getAddress(),
      await challenge12Inventory.getAddress(),
      await (await hre.ethers.getContract<Contract>("Season2Challenge12Quest", deployer)).getAddress(),
      await (await hre.ethers.getContract<Contract>("Season2Challenge12Dungeon", deployer)).getAddress(),
      await (await hre.ethers.getContract<Contract>("Season2Challenge12Victory", deployer)).getAddress(),
      await (await hre.ethers.getContract<Contract>("Season2Challenge12GoldToken", deployer)).getAddress(),
      await (await hre.ethers.getContract<Contract>("Season2Challenge12HeroNFT", deployer)).getAddress(),
    ],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  const challenge12Address = await (
    await hre.ethers.getContract<Contract>("Season2Challenge12", deployer)
  ).getAddress();

  await challenge12Inventory.transferOwnership(challenge12Address);
  await delay(DELAY_TIME);

  console.log("🚩 Challenge #12 deployed");

  // Set addAllowedMinterMultiple in NFTFlags
  const challengeAddresses = [
    await (await hre.ethers.getContract<Contract>("Season2Challenge2", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge3", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge4", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge5", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge6", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge7", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge8", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge9", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge10", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge11", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Season2Challenge12", deployer)).getAddress(),
  ];

  const tx = await nftFlags.addAllowedMinterMultiple(challengeAddresses);
  await tx.wait();
  await delay(DELAY_TIME);

  console.log("Added allowed minters to NFTFlags");

  const txSetGold = await nftFlags.setGoldTokenAddress(
    await (await hre.ethers.getContract<Contract>("Season2Challenge12GoldToken", deployer)).getAddress(),
  );
  await txSetGold.wait();
  await delay(DELAY_TIME);

  console.log("Set gold token address in NFTFlags");

  console.log("✅ All Season 2 CTF contracts deployed");
};

export default deployCtfContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags season2
deployCtfContracts.tags = ["season2"];

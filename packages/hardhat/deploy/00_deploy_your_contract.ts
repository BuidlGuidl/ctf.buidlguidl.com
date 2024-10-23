import { HardhatNetworkHDAccountsConfig, HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { HDNodeWallet } from "ethers";
import { Contract, Mnemonic } from "ethers";

/**
 * Deploys all the needd CTF contracts
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("NFTFlags", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  const nftFlags = await hre.ethers.getContract<Contract>("NFTFlags", deployer);
  console.log("🚩 NFT Flag contract deployed");

  // Enable minting
  await nftFlags.enable();

  // Challenges
  await deploy("Challenge1", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #1 deployed");

  await deploy("Challenge2", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #2 deployed");

  await deploy("Challenge3", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #3 deployed");

  await deploy("Challenge4", {
    from: deployer,
    args: [await nftFlags.getAddress(), deployer],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #4 deployed");

  const challenge5Delegate = await deploy("Challenge5Delegate", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  await deploy("Challenge5", {
    from: deployer,
    args: [await nftFlags.getAddress(), challenge5Delegate.address, deployer],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #5 deployed");

  await deploy("Challenge6", {
    from: deployer,
    args: [await nftFlags.getAddress(), hre.ethers.randomBytes(32)],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #6 deployed");

  await deploy("Challenge8", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #8 deployed");

  await deploy("Challenge9", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #9 deployed");

  await deploy("Challenge11", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #11 deployed");

  await deploy("Challenge12", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #12 deployed");

  // Set allowed minter for Challenge 12
  const challenge12Contract = await hre.ethers.getContract<Contract>("Challenge12", deployer);
  const hAccounts = hre.config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;
  const derivationPath = "m/44'/60'/0'/0/12";
  const challenge12Account = HDNodeWallet.fromMnemonic(Mnemonic.fromPhrase(hAccounts.mnemonic), derivationPath);

  await challenge12Contract.addMinter(challenge12Account.address);

  await deploy("Challenge13", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #13 deployed");

  const challenge14BytecodeBase =
    "0x608060405234801561001057600080fd5b5060405161022c38038061022c83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610084565b60006020828403121561006657600080fd5b81516001600160a01b038116811461007d57600080fd5b9392505050565b610199806100936000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80638fd628f01461003b578063d56d229d14610050575b600080fd5b61004e610049366004610133565b61007f565b005b600054610063906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6001600160a01b03811633146100cc5760405162461bcd60e51b815260206004820152600e60248201526d24b73b30b634b21036b4b73a32b960911b604482015260640160405180910390fd5b6000546040516340c10f1960e01b8152336004820152600e60248201526001600160a01b03909116906340c10f1990604401600060405180830381600087803b15801561011857600080fd5b505af115801561012c573d6000803e3d6000fd5b5050505050565b60006020828403121561014557600080fd5b81356001600160a01b038116811461015c57600080fd5b939250505056fea264697066735822122012c954f090d228ec3f9a3f4c43c3aad1ad6038576f27eb30eb52706c543a585564736f6c63430008140033";
  const nftFlagsAddress = await nftFlags.getAddress();
  const challenge14Bytecode = challenge14BytecodeBase + nftFlagsAddress.slice(2).padStart(64, "0");
  const deployerSigner = await hre.ethers.getSigner(deployer);
  const nonce = await deployerSigner.getNonce();

  const feeData = await hre.ethers.provider.getFeeData();
  const rawTx = {
    nonce: nonce,
    maxFeePerGas: feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    gasLimit: 200_000,
    to: null,
    value: 0,
    data: challenge14Bytecode,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
  };

  const txResponse = await deployerSigner.sendTransaction(rawTx);
  const txReceipt = await txResponse.wait();
  const challenge14Address = txReceipt?.contractAddress;

  console.log("🚩 Challenge #14 deployed at:", challenge14Address);

  // Set addAllowedMinterMultiple in NFTFlags
  const challengeAddresses = [
    await (await hre.ethers.getContract<Contract>("Challenge1", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge2", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge3", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge4", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge5", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge6", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge8", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge9", deployer)).getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge11", deployer)).getAddress(),
    await challenge12Contract.getAddress(),
    await (await hre.ethers.getContract<Contract>("Challenge13", deployer)).getAddress(),
    challenge14Address,
  ];

  const tx = await nftFlags.addAllowedMinterMultiple(challengeAddresses);
  await tx.wait();

  console.log("Added allowed minters to NFTFlags");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["CTF"];

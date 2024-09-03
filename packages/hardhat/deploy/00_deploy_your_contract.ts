import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

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

  await deploy("Challenge1", {
    from: deployer,
    args: [await nftFlags.getAddress()],
    log: true,
    autoMine: true,
  });

  console.log("🚩 Challenge #1 deployed");

  // Set addAllowedMinterMultiple in NFTFlags
  const challengeAddresses = [await (await hre.ethers.getContract<Contract>("Challenge1", deployer)).getAddress()];
  const tx = await nftFlags.addAllowedMinterMultiple(challengeAddresses);
  await tx.wait();

  console.log("Added allowed minters to NFTFlags");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["CTF"];

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a challenge solution contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployChallengeSolution: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // This is the deployer account:
  // - localhost: hardhat account 0
  // - live network: PK in .env file (use `yarn generate` to generate one or fill the .env file with your own PK)
  //
  //   const { deployer } = await hre.getNamedAccounts();
  //   const { deploy } = hre.deployments;
  //
  //   await deploy("Challenge2Solution", {
  //     from: deployer,
  //     log: true,
  //     autoMine: true,
  //   });
  //
  //   console.log("🚩 Challenge Solution contract deployed");
};

export default deployChallengeSolution;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags solution2
deployChallengeSolution.tags = ["solution2"];

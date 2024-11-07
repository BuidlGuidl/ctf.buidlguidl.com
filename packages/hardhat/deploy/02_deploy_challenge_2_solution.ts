import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the Challenge2Solution contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployChallenge2Solution: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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
  //   console.log("🚩 Challenge2Solution contract deployed");
};

export default deployChallenge2Solution;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags solution2
deployChallenge2Solution.tags = ["solution2"];

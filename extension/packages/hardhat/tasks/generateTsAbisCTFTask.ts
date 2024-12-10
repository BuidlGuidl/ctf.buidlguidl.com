import { task } from "hardhat/config";
import generateTsAbisCTF from "../scripts/generateTsAbisCTF";

// Extend the deploy task
task("deploy").setAction(async (args, hre, runSuper) => {
  // Run the original deploy task
  await runSuper(args);
  // Force run the generateTsAbis script
  await generateTsAbisCTF(hre);
});

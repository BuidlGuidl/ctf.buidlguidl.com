import { ethers } from "ethers";
import { parse, stringify } from "envfile";
import * as fs from "fs";
import * as path from "path";

const envFilePaths = ["./.env", "../scripts/.env"];

/**
 * Generate a new random private key and write it to packages/hardhat and packages/scripts .env files
 */
const setNewEnvConfig = (envFilePath: string, existingEnvConfig = {}, randomWallet: ethers.HDNodeWallet) => {
  const newEnvConfig = {
    ...existingEnvConfig,
    DEPLOYER_PRIVATE_KEY: randomWallet.privateKey,
  };

  // Store in .env
  fs.writeFileSync(envFilePath, stringify(newEnvConfig));
  console.log(`📄 Private Key saved to ${path.resolve(envFilePath)} file`);
};

async function setEnvConfigIfNotExists(envFilePath: string, randomWallet: ethers.HDNodeWallet) {
  if (!fs.existsSync(envFilePath)) {
    // No .env file yet.
    setNewEnvConfig(envFilePath, {}, randomWallet);
    return;
  }

  // .env file exists
  const existingEnvConfig = parse(fs.readFileSync(envFilePath).toString());
  setNewEnvConfig(envFilePath, existingEnvConfig, randomWallet);
}

async function isPrivateKeyExistsInAnyEnvFile(): Promise<boolean> {
  const results = await Promise.all(
    envFilePaths.map(async envFilePath => {
      if (!fs.existsSync(envFilePath)) return { hasKey: false, path: envFilePath };
      const config = parse(fs.readFileSync(envFilePath).toString());
      return {
        hasKey: !!config.DEPLOYER_PRIVATE_KEY,
        path: envFilePath,
      };
    }),
  );

  const existingPaths = results.filter(result => result.hasKey).map(result => path.resolve(result.path));

  if (existingPaths.length > 0) {
    console.log("⚠️ You already have a deployer account in:", existingPaths);
  }

  return results.some(result => result.hasKey);
}

async function main() {
  // Check if any env file already has a deployer key
  if (await isPrivateKeyExistsInAnyEnvFile()) {
    return;
  }

  console.log("👛 Generating new Wallet");
  const randomWallet = ethers.Wallet.createRandom();
  console.log("🪄 Generated wallet address:", randomWallet.address);

  await Promise.all(envFilePaths.map(envFilePath => setEnvConfigIfNotExists(envFilePath, randomWallet)));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

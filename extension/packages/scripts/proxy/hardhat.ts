import * as dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { Wallet } from "ethers";
import password from "@inquirer/password";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../hardhat/.env") });

if (!process.argv[2]) {
  console.error("Usage: yarn tsx-with-pk src/yourScript.ts");
  process.exit(1);
}

const targetScript = process.argv[2];
const extraArgs = process.argv.slice(3);

async function main() {
  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;
  if (!encryptedKey) {
    console.log(
      "\nNo encrypted key found, make sure to generate (`yarn generate`) or import account (`yarn account:import`) first by going to root directory and running this commands\n",
    );
    return;
  }

  // Prompt for password and decrypt
  const pass = await password({
    message: "Enter password to decrypt private key:",
  });
  try {
    const wallet = await Wallet.fromEncryptedJson(encryptedKey, pass);
    process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY = wallet.privateKey;
    const child = spawn("tsx", [targetScript, ...extraArgs], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => process.exit(code || 0));
  } catch (e) {
    console.error("Failed to decrypt private key. Wrong password?");
    process.exit(1);
  }
}
main().catch(console.error);

import * as dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { Wallet } from "ethers";
import password from "@inquirer/password";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../hardhat/.env") });

// Find the --file argument
const fileArgIndex = process.argv.indexOf("--file");
if (fileArgIndex === -1 || !process.argv[fileArgIndex + 1]) {
  console.error("Usage: yarn run script --file src/yourScript.ts");
  process.exit(1);
}

const targetScript = process.argv[fileArgIndex + 1];
const extraArgs = process.argv.slice(fileArgIndex + 2);

async function main() {
  const encryptedKey = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;
  if (!encryptedKey) {
    console.log(
      "No encrypted key found, if target network is hardhat we will use the local chain 5th account PK\n"
    );
    const child = spawn("tsx", [targetScript, ...extraArgs], {
      stdio: "inherit",
      env: process.env,
      shell: process.platform === "win32",
    });
    child.on("exit", (code) => process.exit(code || 0));
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

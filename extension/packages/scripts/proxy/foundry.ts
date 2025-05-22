import { listKeystores } from "./listKeystores.js";
import { execSync, spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Find the --file argument
const fileArgIndex = process.argv.indexOf("--file");
if (fileArgIndex === -1 || !process.argv[fileArgIndex + 1]) {
  console.error("Usage: yarn run script --file src/yourScript.ts");
  process.exit(1);
}

const targetScript = process.argv[fileArgIndex + 1];
const extraArgs = process.argv.slice(fileArgIndex + 2);

async function main() {
  // 1. Select keystore
  const selectedKeystore = await listKeystores(
    "Select a keystore to use for deployment (enter the number, e.g., 1): "
  );
  if (!selectedKeystore) {
    console.error("❌ No keystore selected");
    process.exit(1);
  }

  // 2. Decrypt keystore
  let revealPKResult: string;
  try {
    const keystorePath = `${process.env.HOME}/.foundry/keystores/${selectedKeystore}`;
    const revealPKCommand = `cast wallet decrypt-keystore ${keystorePath}`;
    revealPKResult = execSync(revealPKCommand, { stdio: [0, "pipe", "pipe"] })
      .toString()
      .trim();
  } catch (error) {
    console.error("\n❌ Failed to decrypt keystore. Wrong password?");
    process.exit(1);
  }

  // 3. Extract private key
  const match = revealPKResult.match(/private key is:\s*(0x[a-fA-F0-9]{64})/);
  if (!match) {
    console.error("❌ Could not extract private key from output");
    process.exit(1);
  }
  const privateKey = match[1];

  // 4. Set env var and spawn child process
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY = privateKey;
  const child = spawn("tsx", [targetScript, ...extraArgs], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  child.on("exit", (code) => process.exit(code || 0));
}

main().catch(console.error);

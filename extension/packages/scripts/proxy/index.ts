import { existsSync } from "fs";
import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find the --file argument
const fileArgIndex = process.argv.indexOf("--file");
if (fileArgIndex === -1 || !process.argv[fileArgIndex + 1]) {
  console.error("Usage: yarn with-proxy --file src/yourScript.ts");
  process.exit(1);
}

const targetScript = process.argv[fileArgIndex + 1];
const extraArgs = process.argv.slice(fileArgIndex + 2);

// Check for hardhat.ts, otherwise use foundry.ts
const hardhatPath = join(__dirname, "hardhat.ts");
const foundryPath = join(__dirname, "foundry.ts");

const scriptToRun = existsSync(hardhatPath) ? hardhatPath : foundryPath;

const child = spawn(
  "tsx",
  [scriptToRun, "--file", targetScript, ...extraArgs],
  {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  }
);

child.on("exit", (code) => process.exit(code || 0));

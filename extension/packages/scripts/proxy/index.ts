import { existsSync } from "fs";
import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!process.argv[2]) {
  console.error("Usage: yarn tsx-with-pk src/yourScript.ts");
  process.exit(1);
}

const targetScript = process.argv[2];
const extraArgs = process.argv.slice(3);

// Check for hardhat.ts, otherwise use foundry.ts
const hardhatPath = join(__dirname, "hardhat.ts");
const foundryPath = join(__dirname, "foundry.ts");

const scriptToRun = existsSync(hardhatPath) ? hardhatPath : foundryPath;

const child = spawn("tsx", [scriptToRun, targetScript, ...extraArgs], {
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code || 0));

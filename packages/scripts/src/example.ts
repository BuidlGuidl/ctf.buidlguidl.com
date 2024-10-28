import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import deployedContracts from "../contracts/deployedContracts";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as dotenv from "dotenv";
// TODO: Use root .env or scripts/.env
dotenv.config({ path: path.join(__dirname, "../../hardhat/.env") });

// We use the private key of account generated via `yarn generate`, if not present we use default hardhat last account
const MY_WALLET_PK = (process.env.DEPLOYER_PRIVATE_KEY ??
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e") as `0x${string}`;
const myWalletAccount = privateKeyToAccount(MY_WALLET_PK);

// We need wallet client to do write operations/send transactions
const walletClient = createWalletClient({
  account: myWalletAccount,
  chain: hardhat,
  transport: http(),
});

// An public client is used to read different states of blockchain
const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// Viem contract instance helps you interact with deployed contract
const challenge1Contract = getContract({
  // @ts-ignore will be defined after deployment of contract
  address: deployedContracts[31337].Challenge1.address,
  // @ts-ignore will be defined after deployment of contract
  abi: deployedContracts[31337].Challenge1.abi,
  // NOTE: Here walletClient is optional and only required for write operations
  client: { public: publicClient, wallet: walletClient },
});

async function main() {
  // Writing to a contract
  const txHash = await challenge1Contract.write.registerTeam(["Bob", 1]);
  console.log(
    `📝 Called 'registerTeam' function with address ${myWalletAccount.address} and name 'Bob', txHash: ${txHash}`,
  );

  // Reading from a contract
  const teamInfo = await challenge1Contract.read.teamInfo([
    myWalletAccount.address,
  ]);
  console.log("👤Team name is:", teamInfo[0]);
  console.log("👤Team size is:", teamInfo[1]);

  // Reading blockchain state
  const blockNumber = await publicClient.getBlockNumber();
  console.log("🧱 Block number is:", blockNumber);
}

main().catch(console.error);

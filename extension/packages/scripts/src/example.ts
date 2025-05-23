import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";
import * as dotenv from "dotenv";
import { contractsData } from "../contracts/types";

dotenv.config();

// If you want to deploy to optimism:
// set TARGET_CHAIN = chains.optimism;
const TARGET_CHAIN = chains.hardhat;

const LOCAL_CHAIN_5TH_ACCOUNT_PK =
  "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba" as const;

// Run this script directly `yarn tsx src/example.ts` in local chain (uses test account PK with loaded funds).
// Run this script via `yarn tsx-with-pk --file src/example.ts` to use your own PK (generated via `yarn generate` or `yarn account:import`)
const MY_WALLET_PK =
  (process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY as `0x${string}`) ||
  LOCAL_CHAIN_5TH_ACCOUNT_PK;
const myWalletAccount = privateKeyToAccount(MY_WALLET_PK);

// We need wallet client to do write operations/send transactions
const walletClient = createWalletClient({
  account: myWalletAccount,
  chain: TARGET_CHAIN,
  transport: http(),
});

// An public client is used to read different states of blockchain
const publicClient = createPublicClient({
  chain: TARGET_CHAIN,
  transport: http(),
});

// Viem contract instance helps you interact with deployed contract
const challenge1Contract = getContract({
  // @ts-ignore will be defined after deployment of contract
  address: contractsData[TARGET_CHAIN.id].Challenge1.address,
  // @ts-ignore will be defined after deployment of contract
  abi: contractsData[TARGET_CHAIN.id].Challenge1.abi,
  // NOTE: Here walletClient is optional and only required for write operations
  client: { public: publicClient, wallet: walletClient },
});

async function main() {
  // Writing to a contract
  const txHash = await challenge1Contract.write.registerMe(["Bob"]);
  console.log(
    `📝 Called 'registerMe' function with address ${myWalletAccount.address} and name 'Bob', txHash: ${txHash}`
  );

  // Waits for the Transaction to be included on a Block (one confirmation)
  await publicClient.waitForTransactionReceipt({ hash: txHash });

  // Reading from a contract
  const builderInfo = await challenge1Contract.read.builderNames([
    myWalletAccount.address,
  ]);
  console.log("👤Builder name is:", builderInfo);

  // Reading blockchain state
  const blockNumber = await publicClient.getBlockNumber();
  console.log("🧱 Block number is:", blockNumber);
}

main().catch(console.error);

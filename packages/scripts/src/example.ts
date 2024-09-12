import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import deployedContracts from "../contracts/deployedContracts";

// Hardhat's last account private key (for testing purposes)
const HARDHAT_LAST_ACCOUNT_PK =
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";
const hardhatLastAccount = privateKeyToAccount(HARDHAT_LAST_ACCOUNT_PK);

// We need wallet client to do write operations/send transactions
const walletClient = createWalletClient({
  account: hardhatLastAccount,
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
  const txHash = await challenge1Contract.write.registerMe(["Bob"]);
  console.log(
    `📝 Called 'registerMe' function with address ${hardhatLastAccount.address} and name 'Bob', txHash: ${txHash}`,
  );

  // Reading from a contract
  const builderName = await challenge1Contract.read.builderNames([
    hardhatLastAccount.address,
  ]);
  console.log("👷 Builder name is:", builderName);

  // Reading blockchain state
  const blockNumber = await publicClient.getBlockNumber();
  console.log("🧱 Block number is:", blockNumber);
}

main().catch(console.error);

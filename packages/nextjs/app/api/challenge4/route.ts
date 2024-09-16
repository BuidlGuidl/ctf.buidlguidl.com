import { NextResponse } from "next/server";
import { recoverTypedDataAddress } from "viem";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import deployedContracts from "~~/contracts/deployedContracts";
import scaffoldConfig from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const EIP_712_DOMAIN = {
  name: "BuidlGuidl CTF - Devcon SEA",
  version: "1",
} as const;

export const EIP_712_MINT_FLAG = {
  Message: [
    { name: "operation", type: "string" },
    { name: "minter", type: "string" },
  ],
} as const;

type ReqBody = {
  signature?: `0x${string}`;
  minter?: string;
};

const operation = "mintFlag";
// defaults to hardhat [0] private key
const deployerPrivateKey =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const targetNetwork = scaffoldConfig.targetNetworks[0];
const RPC_URL = getAlchemyHttpUrl(targetNetwork.id);
// @ts-ignore will be defined after deployment of contract
const contractAddress = deployedContracts[targetNetwork.id].Challenge4.address;
const challenge4ContractAbi = parseAbi(["function mintFlag(address _minter) public"]);

export async function POST(req: Request) {
  try {
    const { minter, signature } = (await req.json()) as ReqBody;

    if (!minter || !signature) {
      return NextResponse.json({ error: "Invalid form details submitted" }, { status: 400 });
    }

    const recoveredAddress = await recoverTypedDataAddress({
      domain: EIP_712_DOMAIN,
      types: EIP_712_MINT_FLAG,
      primaryType: "Message",
      message: { operation, minter },
      signature: signature,
    });

    if (recoveredAddress !== minter) {
      return NextResponse.json({ error: "Recovered address did not match minter" }, { status: 401 });
    }

    const publicClient = createPublicClient({
      chain: targetNetwork,
      transport: http(RPC_URL),
    });

    const account = privateKeyToAccount(deployerPrivateKey as `0x${string}`);

    const walletClient = createWalletClient({
      account,
      chain: targetNetwork,
      transport: http(RPC_URL),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: challenge4ContractAbi,
      functionName: "mintFlag",
      args: [minter],
      account: account.address,
    });

    const hash = await walletClient.writeContract(request);
    console.log("Transaction hash:", hash);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error processing request" }, { status: 500 });
  }
}

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  AbiCoder,
  Contract,
  Wallet,
  concat,
  getCreateAddress,
  hexlify,
  keccak256,
  randomBytes,
  solidityPacked,
} from "ethers";
import { SEASON3_CHALLENGE8_BYTECODE } from "../scripts/season3Challenge8Bytecode";

/**
 * Helper function to wait for a specified number of milliseconds
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Deploys all the Season 3 (Mumbai) CTF contracts.
 * Challenge #1 is shared with Season 1 (Season3NFTFlags requires Season 1 - Challenge #1 to be completed).
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCtfSeason3Contracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const isLocal = hre.network.name === "localhost" || hre.network.name === "hardhat";
  const DELAY_TIME = isLocal ? 0 : 2000;

  // NFTFlags contract for Season 1 deployed to Optimism Mainnet
  let season1NftFlagsAddress = "0xc1Ebd7a78FE7c075035c516B916A7FB3f33c26cE";
  if (isLocal) {
    season1NftFlagsAddress = (await hre.deployments.get("Season1NFTFlags")).address;
  }

  // :: NFT Flags ::
  await deploy("Season3NFTFlags", {
    from: deployer,
    args: [deployer, season1NftFlagsAddress],
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);

  const nftFlags = await hre.ethers.getContract<Contract>("Season3NFTFlags", deployer);
  const nftFlagsAddress = await nftFlags.getAddress();
  console.log("🚩 Season 3 NFT Flags contract deployed");

  if (!(await nftFlags.enabled())) {
    await (await nftFlags.enable()).wait();
    await delay(DELAY_TIME);
    console.log("🔓 Minting enabled");
  }

  const deployChallenge = async (name: string, extraArgs: unknown[] = []) => {
    await deploy(name, {
      from: deployer,
      args: [nftFlagsAddress, ...extraArgs],
      log: true,
      autoMine: true,
    });
    await delay(DELAY_TIME);
    console.log(`🚩 ${name} deployed`);
  };

  // :: Challenge 2 ::
  await deployChallenge("Season3Challenge2", [hexlify(randomBytes(32))]);

  // :: Challenge 3 ::
  await deployChallenge("Season3Challenge3");

  // :: Challenge 4 ::
  await deployChallenge("Season3Challenge4");

  // :: Challenge 5 ::
  await deployChallenge("Season3Challenge5");

  // :: Challenge 6 ::
  const pool = await deploy("Season3Challenge6Pool", { from: deployer, log: true, autoMine: true });
  await delay(DELAY_TIME);
  await deployChallenge("Season3Challenge6", [pool.address]);

  // :: Challenge 7 ::
  await deployChallenge("Season3Challenge7");

  // :: Challenge 8 (unverified, deployed from bytecode) ::
  await deploy("Season3Challenge8", {
    from: deployer,
    contract: {
      abi: [],
      bytecode: concat([
        SEASON3_CHALLENGE8_BYTECODE,
        AbiCoder.defaultAbiCoder().encode(["address"], [nftFlagsAddress]),
      ]),
    },
    log: true,
    autoMine: true,
  });
  await delay(DELAY_TIME);
  console.log("🚩 Season3Challenge8 deployed");

  // :: Challenge 9 ::
  // The voucher signature commits to the challenge address, so we predict it from the deployer nonce.
  const { chainId } = await hre.ethers.provider.getNetwork();
  const ATTEMPTS = 3;
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const nonce = await hre.ethers.provider.getTransactionCount(deployer, "pending");
    const challengeAddress = getCreateAddress({ from: deployer, nonce });

    const signer = Wallet.createRandom();
    const recipient = Wallet.createRandom().address;
    const digest = keccak256(
      solidityPacked(
        ["string", "uint256", "address", "address"],
        ["BG CTF VOUCHER", chainId, challengeAddress, recipient],
      ),
    );
    const signature = signer.signingKey.sign(digest);

    await deployChallenge("Season3Challenge9", [signer.address, recipient, signature.v, signature.r, signature.s]);

    const deployment = await hre.deployments.get("Season3Challenge9");
    if (deployment.address.toLowerCase() === challengeAddress.toLowerCase()) break;
    if (attempt === ATTEMPTS) {
      throw new Error(`Season3Challenge9 deployed at ${deployment.address}, expected ${challengeAddress}`);
    }
    console.log(`Season3Challenge9 deployed at ${deployment.address}, expected ${challengeAddress}, retrying`);
  }

  // :: Challenge 10 ::
  await deployChallenge("Season3Challenge10");

  // :: Challenge 11 ::
  const wallet = await deploy("Season3Challenge11Wallet", { from: deployer, log: true, autoMine: true });
  await delay(DELAY_TIME);
  await deployChallenge("Season3Challenge11", [wallet.address]);

  // :: Challenge 12 ::
  await deployChallenge("Season3Challenge12");

  // Set allowed minters in NFTFlags
  const challengeAddresses = await Promise.all(
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(async i => (await hre.deployments.get(`Season3Challenge${i}`)).address),
  );
  await (await nftFlags.addAllowedMinterMultiple(challengeAddresses)).wait();
  await delay(DELAY_TIME);
  console.log("Added allowed minters to Season3NFTFlags");

  // Link Challenge 8 (needed for the Challenge 12 final boss)
  await (await nftFlags.setChallenge8((await hre.deployments.get("Season3Challenge8")).address)).wait();
  await delay(DELAY_TIME);
  console.log("🔗 Linked Season3Challenge8 to Season3NFTFlags");

  console.log("✅ All Season 3 CTF contracts deployed");
};

export default deployCtfSeason3Contracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags season3
deployCtfSeason3Contracts.tags = ["season3"];

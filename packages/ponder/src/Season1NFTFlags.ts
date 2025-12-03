import { ponder } from "@/generated";

ponder.on("Season1NFTFlags:FlagMinted", async ({ event, context }) => {
  const { client } = context;
  const { Challenge, User } = context.db;
  const { Season1NFTFlags } = context.contracts;

  const pointsPerChallenge = 100;

  const tokenUri = await client.readContract({
    abi: Season1NFTFlags.abi,
    address: Season1NFTFlags.address,
    functionName: "tokenURI",
    args: [event.args.tokenId],
  });

  await User.upsert({
    id: event.args.minter,
    create: {
      points: pointsPerChallenge,
      sortOrder:
        100000000000n * BigInt(pointsPerChallenge) -
        BigInt(event.block.timestamp),
      challengesCount: 1,
      updated: Number(event.block.timestamp),
    },
    update: ({ current }) => ({
      points: current.points + pointsPerChallenge,
      sortOrder:
        100000000000n * BigInt(current.points + pointsPerChallenge) -
        BigInt(event.block.timestamp),
      challengesCount: current.challengesCount + 1,
      updated: Number(event.block.timestamp),
    }),
  });

  // Create a new NFTFlag
  await Challenge.create({
    id: `1-${event.args.tokenId}`,
    data: {
      season: 1,
      challengeId: event.args.challengeId,
      tokenURI: tokenUri,
      timestamp: Number(event.block.timestamp),
      ownerId: event.args.minter,
      points: pointsPerChallenge,
    },
  });
});

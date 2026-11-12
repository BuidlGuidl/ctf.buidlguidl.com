import { ponder } from "@/generated";

ponder.on("Season3NFTFlags:FlagMinted", async ({ event, context }) => {
  const { client } = context;
  const { Challenge, User } = context.db;
  const { Season3NFTFlags } = context.contracts;

  const pointsPerChallenge = 100;

  const tokenUri = await client.readContract({
    abi: Season3NFTFlags.abi,
    address: Season3NFTFlags.address,
    functionName: "tokenURI",
    args: [event.args.tokenId],
  });

  await User.update({
    id: event.args.minter,
    data: ({ current }) => ({
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
    id: `3-${event.args.tokenId}`,
    data: {
      season: 3,
      challengeId: event.args.challengeId,
      tokenURI: tokenUri,
      timestamp: Number(event.block.timestamp),
      ownerId: event.args.minter,
      points: pointsPerChallenge,
    },
  });
});

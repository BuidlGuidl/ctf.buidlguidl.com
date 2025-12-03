import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  User: p.createTable({
    id: p.hex(),
    name: p.string().optional(),
    challenges: p.many("Challenge.ownerId"),
    challengesCount: p.int(),
    points: p.int(),
    updated: p.int(),
    sortOrder: p.bigint(),
  }, {
    // Index the `updated` and `challengesCount` column to speed up stats
    updatedIndex: p.index("updated"),
    challengesCountIndex: p.index("challengesCount"),
  }),
  Challenge: p.createTable({
    id: p.string(),
    season: p.int(),
    challengeId: p.bigint(),
    tokenURI: p.string(),
    points: p.int(),
    timestamp: p.int(),
    ownerId: p.hex().references("User.id"),

    owner: p.one("ownerId"),
  }, {
    // Index the `challengeId` and `timestamp` and `season` column to speed up stats
    challengeIdSeasonIndex: p.index(["challengeId", "season"]),
    timestampIndex: p.index("timestamp"),
    seasonIndex: p.index("season"),
  }),
}));

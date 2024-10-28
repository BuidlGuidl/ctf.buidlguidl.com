import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  Team: p.createTable({
    id: p.hex(),
    name: p.string().optional(),
    size: p.int().optional(),
    challenges: p.many("Challenge.ownerId"),
    points: p.int(),
    updated: p.int(),
    sortOrder: p.bigint(),
  }),
  Challenge: p.createTable({
    id: p.bigint(),
    challengeId: p.bigint(),
    tokenURI: p.string(),
    points: p.int(),
    timestamp: p.int(),
    ownerId: p.hex().references("Team.id"),

    owner: p.one("ownerId"),
  }),
}));

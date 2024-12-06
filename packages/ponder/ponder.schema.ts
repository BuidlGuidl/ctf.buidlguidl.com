import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  User: p.createTable({
    id: p.hex(),
    name: p.string().optional(),
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
    ownerId: p.hex().references("User.id"),

    owner: p.one("ownerId"),
  }),
}));

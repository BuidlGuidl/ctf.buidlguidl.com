import { ponder } from "@/generated";
import { graphql, count, sql, gte } from "@ponder/core";

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.get("/stats", async (c) => {
    const usersCount = await c.db.select({ value: count() }).from(c.tables.User);
    const challengesCount = await c.db.select({ value: count() }).from(c.tables.Challenge);

    const lastMonth = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);

    const usersCountLastMonth = await c.db.select({ value: count() }).from(c.tables.User).where(gte(c.tables.User.updated, lastMonth));
    const challengesCountLastMonth = await c.db.select({ value: count() }).from(c.tables.Challenge).where(gte(c.tables.Challenge.timestamp, lastMonth));

    const challengesStats = await c.db.select({
        challenge: c.tables.Challenge.challengeId,
        count: sql<number>`cast(count(${c.tables.Challenge}.id) as int)`,
    })
        .from(c.tables.Challenge)
        .groupBy(c.tables.Challenge.challengeId);

    const usersStats = await c.db.select({
        challengesCount: c.tables.User.challengesCount,
        count: sql<number>`cast(count(${c.tables.User}.id) as int)`,
    })
        .from(c.tables.User)
        .groupBy(c.tables.User.challengesCount);

    return c.json({
        users: {
            total: usersCount[0]?.value || 0,
            lastMonth: usersCountLastMonth[0]?.value || 0,
            stats: usersStats,
        },
        challenges: {
            total: challengesCount[0]?.value || 0,
            lastMonth: challengesCountLastMonth[0]?.value || 0,
            stats: challengesStats.map((stat) => ({
                challenge: Number(stat.challenge),
                count: stat.count,
            })),
        },
    });
});


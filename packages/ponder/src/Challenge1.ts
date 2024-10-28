import { ponder } from "@/generated";

ponder.on("Challenge1:TeamInit", async ({ event, context }) => {
  const { Team } = context.db;

  await Team.upsert({
    id: event.args.team,
    create: {
      points: 0,
      sortOrder: 0n,
      name: event.args.name,
      size: event.args.teamSize,
      updated: Number(event.block.timestamp),
    },
    update: {
      name: event.args.name,
      size: event.args.teamSize,
      updated: Number(event.block.timestamp),
    },
  });
});

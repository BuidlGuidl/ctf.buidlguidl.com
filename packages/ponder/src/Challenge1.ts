import { ponder } from "@/generated";

ponder.on("Challenge1:BuilderInit", async ({ event, context }) => {
  const { User } = context.db;

  await User.create({
    id: event.args.player,
    data: {
      points: 0,
      sortOrder: 0n,
      name: event.args.name,
      updated: Number(event.block.timestamp),
    },
  });
});

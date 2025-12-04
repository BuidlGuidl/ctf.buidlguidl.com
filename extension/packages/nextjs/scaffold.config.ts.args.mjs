export const extraConfigTypeName = "ExtraConfig";

export const preContent = `
export type ${extraConfigTypeName} = {
  // startBlocks for event watching
  startBlockSeason1: number | undefined;
  startBlockSeason2: number | undefined;
}
`;

export const configOverrides = {
  startBlockSeason1: 130627582,
  startBlockSeason2: 130627582,
};

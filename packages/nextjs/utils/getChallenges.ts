// Challenge names are organized by season, then challengeId
export const CHALLENGE_NAMES: Record<number, Record<string, string>> = {
  1: {
    "1": "The Greeting",
    "2": "Just Call Me Maybe",
    "3": "Empty Contract?",
    "4": "Who Can Sign This?",
    "5": "Give Me My Points!",
    "6": "Meet All The Conditions",
    "7": "Delegate",
    "8": "The Unverified",
    "9": "Password Protected",
    "10": "Give 1 Get 1",
    "11": "Who Can Call Me?",
    "12": "Give Me The Block!",
  },
  2: {
    "1": "The Greeting",
    "2": "Show Me Your Key",
    "3": "Let Me In!",
    "4": "Pay Me!",
    "5": "Count My Assembly",
    "6": "Give Me My Points!",
    "7": "Calldata FTW",
    "8": "Locked",
    "9": "The Unverified",
    "10": "Who Can Call Me?",
    "11": "Give Me The Block!",
    "12": "Conquer The Game",
  },
};

// Challenge descriptions (short teasers) organized by season, then challengeId
export const CHALLENGE_DESCRIPTIONS: Record<number, Record<string, string>> = {
  1: {
    "1": "Interact with the Challenge #1 contract and register yourself as a player.",
    "2": "Interact with the Challenge #2 contract. In this case, not all calls are allowed.",
    "3": "Mint your flag using a contract with no deployed code.",
    "4": "Mint your flag using the right signature.",
    "5": "Obtain this flag by first getting 10 points.",
    "6": "Mint your flag meeting all the conditions.",
    "7": "Only the owner of the contract may mint this flag.",
    "8": "Mint your flag in this unverified contract.",
    "9": "You only need a password to mint your flag.",
    "10": "There is no contract for this challenge, it's already on the Season1NFTFlags contract.",
    "11": "Interact with the Challenge #11 contract. In this case, not all calls are allowed.",
    "12": "Mint your flag using the right block.",
  },
  2: {
    "1": "Complete Challenge #1 in Season 1 to automatically complete this challenge.",
    "2": "Provide the right key to the contract to mint your flag.",
    "3": "You just have to ask the right way.",
    "4": "Pay me! (but not directly)",
    "5": "Set the right parameters to meet the counter's requirements.",
    "6": "Obtain this flag by getting points and upgrading levels.",
    "7": "Sometimes, the calldata is the only way to talk to a contract.",
    "8": "This flag is protected behind a triple lock.",
    "9": "Mint your flag in this unverified contract.",
    "10": "Interact with the Challenge #10 contract. In this case, not all calls are allowed.",
    "11": "Mint your flag using the right block (if you are lucky).",
    "12": "Unlock the achievements, win the game, and capture the flag.",
  },
};

export const SEASONS: Record<number, { name: string; slug: string }> = {
  1: { name: "Bangkok (S1)", slug: "bangkok" },
  2: { name: "Buenos Aires (S2)", slug: "buenos-aires" },
};

export const getSeasonBySlug = (slug: string): number | undefined => {
  const entry = Object.entries(SEASONS).find(([, season]) => season.slug === slug);
  return entry ? Number(entry[0]) : undefined;
};

export const getSlugBySeason = (seasonNumber: number): string | undefined => {
  return SEASONS[seasonNumber]?.slug;
};

export const TOTAL_CHALLENGES_PER_SEASON = 12;

export const TOTAL_CHALLENGES = TOTAL_CHALLENGES_PER_SEASON * Object.keys(SEASONS).length;

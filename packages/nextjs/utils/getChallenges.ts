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

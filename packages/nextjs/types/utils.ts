export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
  ? Current
  : Current | Tuple<T, MaxLength, [T, ...Current]>;

export type TeamChallenge = {
  id: string;
  challengeId: number;
  tokenURI: string;
  timestamp: number;
  points: number;
};

export type Team = {
  id: string;
  name: string;
  size: number;
  points: number;
  updated: number;
  challenges?: { items: TeamChallenge[] };
};

export type TeamsData = { teams: { items: Team[] } };

export type TeamChallengesData = { challenges: { items: TeamChallenge[] } };

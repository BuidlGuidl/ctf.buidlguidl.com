export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
  ? Current
  : Current | Tuple<T, MaxLength, [T, ...Current]>;

export type TeamChallenge = {
  id: number;
  challengeId: number;
  timestamp: number;
  points: number;
};

export type Team = {
  id: string;
  name: string;
  size: number;
  points: number;
  updated: number;
  challenges?: TeamChallenge[];
};

export type TeamsData = { [key: string]: Team };

export type TeamsDataArray = Team[];

export type TokenURI = {
  name: string;
  description: string;
  image: string;
};

export type TokensURIData = { [key: string]: TokenURI };

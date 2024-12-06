export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
  ? Current
  : Current | Tuple<T, MaxLength, [T, ...Current]>;

export type UserChallenge = {
  id: string;
  challengeId: number;
  tokenURI: string;
  timestamp: number;
  points: number;
};

export type User = {
  id: string;
  name: string;
  points: number;
  updated: number;
  challenges?: { items: UserChallenge[] };
};

export type UsersData = { users: { items: User[] } };

export type UserChallengesData = { challenges: { items: UserChallenge[] } };

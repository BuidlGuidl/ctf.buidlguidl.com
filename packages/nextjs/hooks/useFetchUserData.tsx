"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { UsersData } from "~~/types/utils";
import { CHALLENGE_NAMES } from "~~/utils/getChallenges";

export type ChallengeProgress = { challengeId: string; solved: boolean; timestamp?: number };

const fetchUser = async (userId: string) => {
  const UserQuery = gql`
    query Users($userId: String!) {
      users(where: { id: $userId }) {
        items {
          id
          name
          points
          updated
          challenges(orderBy: "challengeId", orderDirection: "asc") {
            items {
              id
              season
              challengeId
              tokenURI
              timestamp
              points
            }
          }
        }
      }
    }
  `;
  const data = await request<UsersData>(process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069", UserQuery, {
    userId,
  });
  return data;
};

export const useFetchUserData = ({ address }: { address?: string }) => {
  const { data, isLoading, isError } = useQuery<UsersData>({
    queryKey: ["user", address],
    queryFn: () => fetchUser(address || ""),
    enabled: !!address,
    refetchInterval: 10000,
  });

  const userData = data?.users?.items[0];

  const hasCompletedChallenge1 = userData?.challenges?.items.some(challenge => Number(challenge.challengeId) === 1);

  const challengesBySeasons = Object.entries(CHALLENGE_NAMES).reduce((acc, [seasonKey, challengesMap]) => {
    const season = Number(seasonKey);
    const challengeIds = Object.keys(challengesMap).sort((a, b) => Number(a) - Number(b));

    acc[season] = challengeIds.map(challengeId => {
      const userChallenge = userData?.challenges?.items.find(c => {
        const challengeIdNumber = Number(challengeId);
        const cChallengeIdNumber = Number(c.challengeId);

        // Challenge #1 is shared across seasons: if it's completed in any season, mark it as solved
        if (challengeIdNumber === 1) {
          return cChallengeIdNumber === 1;
        }

        return c.season === season && cChallengeIdNumber === challengeIdNumber;
      });

      if (userChallenge) {
        return {
          challengeId,
          solved: true,
          timestamp: userChallenge.timestamp,
        };
      }

      return {
        challengeId,
        solved: false,
      };
    });

    return acc;
  }, {} as Record<number, ChallengeProgress[]>);

  return {
    userData,
    hasCompletedChallenge1,
    challengesBySeasons,
    loading: isLoading,
    error: isError,
  };
};

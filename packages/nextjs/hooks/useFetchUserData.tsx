"use client";

import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { UsersData } from "~~/types/utils";

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

  const hasCompletedChallenge1 = data?.users?.items[0]?.challenges?.items.some(
    challenge => Number(challenge.challengeId) === 1,
  );

  return {
    userData: data?.users?.items[0],
    hasCompletedChallenge1,
    loading: isLoading,
    error: isError,
  };
};

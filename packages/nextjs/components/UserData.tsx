"use client";

import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { UsersData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";

export const UserData: React.FC = () => {
  const { address: connectedAddress } = useAccount();

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

  const { data: usersData } = useQuery<UsersData>({
    queryKey: ["user", connectedAddress],
    queryFn: () => fetchUser(connectedAddress || ""),
    enabled: !!connectedAddress,
  });

  return (
    <>
      {connectedAddress && usersData?.users.items[0] && (
        <div className="mt-8 p-6 bg-base-200 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold">Address:</p>
              <Address address={connectedAddress} />
            </div>
            <div>
              <p className="font-bold">Name:</p>
              <p>{usersData.users.items[0].name}</p>
            </div>
            <div>
              <p className="font-bold">Points:</p>
              <p>{usersData.users.items[0].points}</p>
            </div>
            <div>
              <p className="font-bold">Last Updated:</p>
              <p>{getFormattedDateTime(new Date(usersData.users.items[0].updated * 1000))}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Your Challenges</h3>
            {usersData.users.items[0].challenges?.items && usersData.users.items[0].challenges?.items?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersData.users.items[0].challenges?.items.map(challenge => (
                  <div key={challenge.id} className="bg-base-100 p-4 rounded-md shadow">
                    <p className="font-bold">Challenge {challenge.challengeId}</p>
                    <p>Points: {challenge.points}</p>
                    <p>Minted: {getFormattedDateTime(new Date(challenge.timestamp * 1000))}</p>
                    <Image
                      src={JSON.parse(atob(challenge.tokenURI.substring(29))).image}
                      alt={`Challenge ${challenge.challengeId}`}
                      width="300"
                      height="300"
                      className="mt-2 w-full h-auto rounded"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>No completed challenges yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

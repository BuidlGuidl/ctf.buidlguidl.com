"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { UsersData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";

export const UserData = ({ address }: { address: string }) => {
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
    queryKey: ["user", address],
    queryFn: () => fetchUser(address || ""),
    enabled: !!address,
  });

  if (usersData?.users.items.length === 0) {
    return (
      <div role="alert" className="md:p-6 alert border border-green-600 rounded-none">
        <ExclamationTriangleIcon className="w-6 h-6" />
        <span className="text-lg md:text-xl">No Flags Captured</span>
        <div>
          <Link href="/challenge/1" className="btn btn-sm btn-primary rounded-md">
            Start Challenges →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {address && usersData?.users.items[0] && (
        <div>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Address:</p>
              <Address address={address} size="xl" />
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Name:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">{usersData.users.items[0].name}</p>
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Points:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">{usersData.users.items[0].points}</p>
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Last Updated:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">
                {getFormattedDateTime(new Date(usersData.users.items[0].updated * 1000))}
              </p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="font-dotGothic text-xl md:text-2xl tracking-wide">Flags Captured</h3>
            {usersData.users.items[0].challenges?.items && usersData.users.items[0].challenges?.items?.length > 0 ? (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usersData.users.items[0].challenges?.items.map(challenge => (
                  <div key={challenge.id} className="bg-gray-800 p-6">
                    <p className="mt-0 font-bold">Challenge {challenge.challengeId}</p>
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

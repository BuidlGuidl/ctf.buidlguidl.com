"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import type { NextPage } from "next";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { User, UserChallenge, UserChallengesData, UsersData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";

const Leaderboard: NextPage = () => {
  const [isUserChallengesModalOpen, setIsUserChallengesModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const UsersQuery = gql`
      query Users {
        users(orderBy: "sortOrder", orderDirection: "desc") {
          items {
            id
            name
            points
            updated
          }
        }
      }
    `;
    const data = await request<UsersData>(process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069", UsersQuery);
    return data;
  };

  const fetchUserChallenges = async (userId: string) => {
    const UserChallengesQuery = gql`
      query UserChallenges($userId: String!) {
        challenges(orderBy: "timestamp", orderDirection: "desc", where: { ownerId: $userId }) {
          items {
            id
            challengeId
            tokenURI
            timestamp
            points
          }
        }
      }
    `;
    const data = await request<UserChallengesData>(
      process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069",
      UserChallengesQuery,
      { userId },
    );
    return data;
  };

  const { data: usersData } = useQuery<UsersData>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { data: userChallengesData } = useQuery<UserChallengesData>({
    queryKey: ["userChallenges", selectedUser?.id],
    queryFn: () => fetchUserChallenges(selectedUser?.id || ""),
    enabled: !!selectedUser,
  });

  if (!usersData) {
    return (
      <div className="flex items-center flex-col flex-grow pt-20">
        <div className="loading loading-dots loading-md"></div>
      </div>
    );
  }

  if (!usersData.users.items.length) {
    return (
      <div className="flex items-center flex-col flex-grow pt-20">
        <h1 className="text-3xl font-dotGothic tracking-wide md:text-4xl">No Players Found</h1>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 min-h-screen bg-[url(/dot-texture.svg)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-dotGothic tracking-wide md:text-4xl">Leaderboard</h1>
        <div className="mt-8 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden bg-base-100 border-2 border-t-4 border-l-4 border-green-700 border-t-green-600 border-l-green-500">
                <table className="min-w-full divide-y divide-green-600">
                  <thead className="bg-green-600/30 font-dotGothic tracking-wide text-left text-gray-50 md:text-xl">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
                        Rank
                      </th>
                      <th scope="col" className="px-3 py-3.5">
                        Player Name
                      </th>
                      <th scope="col" className="px-3 py-3.5">
                        Address
                      </th>
                      <th scope="col" className="px-3 py-3.5">
                        Points
                      </th>
                      <th scope="col" className="px-3 py-3.5">
                        Updated
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">View Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-base-100 md:text-lg">
                    {usersData.users.items.map((user: User, index: number) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">{index + 1}</td>
                        <td className="whitespace-nowrap px-3 py-4">{user.name}</td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <Address address={user.id} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">{user.points}</td>
                        <td className="whitespace-nowrap px-3 py-4">
                          {getFormattedDateTime(new Date(user.updated * 1000))}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                          <button
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUserChallengesModalOpen(true);
                            }}
                          >
                            <MagnifyingGlassIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <dialog id="user_challenges_modal" className="modal bg-black/65" open={isUserChallengesModalOpen}>
        <div className="modal-box pt-0 px-0 border border-gray-400 rounded-none">
          <form method="dialog" className="flex items-center justify-between border-b border-gray-400">
            <h3 className="mb-1 ml-4 py-1 font-dotGothic tracking-wide text-2xl text-center">{selectedUser?.name}</h3>

            <button
              className="ml-auto px-4 py-2 h-full border-l border-gray-400 rounded-none font-dotGothic text-xl text-gray-400 hover:text-white"
              onClick={() => setIsUserChallengesModalOpen(false)}
            >
              X
            </button>
          </form>
          <div className="mt-6 flex flex-col items-center space-y-8">
            {userChallengesData?.challenges.items.map((challenge: UserChallenge) => (
              <div key={challenge.id} className="flex flex-col items-center">
                <p className="m-2">
                  Challenge{challenge.challengeId} minted at{" "}
                  {getFormattedDateTime(new Date(challenge.timestamp * 1000))}
                </p>
                <p className="mb-2 mt-0">({challenge.points} points)</p>
                <Image
                  src={JSON.parse(atob(challenge.tokenURI.substring(29))).image}
                  alt={`Challenge ${challenge.challengeId.toString()}`}
                  width="300"
                  height="300"
                  className="border-2 border-black rounded-3xl p-6 pt-6 bg-gray-200"
                />
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Leaderboard;

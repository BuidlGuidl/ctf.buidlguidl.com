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
        <h1 className="text-center text-4xl font-bold">No players found</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-20">
        <h1 className="text-center text-4xl font-bold">Leaderboard</h1>
        <div className="flex flex-col">
          {usersData.users.items.map((user: User) => (
            <div key={user.id} className="flex items-center space-x-2">
              <p className="my-2 font-medium">{user.name}</p>
              <p>
                <Address address={user.id} />
              </p>
              <p className="my-2 font-medium">- {user.points} points -</p>
              <p className="my-2 font-medium">{getFormattedDateTime(new Date(user.updated * 1000))}</p>
              <button
                className="btn btn-sm btn-circle"
                onClick={() => {
                  setSelectedUser(user);
                  setIsUserChallengesModalOpen(true);
                }}
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      <dialog id="user_challenges_modal" className="modal" open={isUserChallengesModalOpen}>
        <div className="modal-box border-2">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsUserChallengesModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-xl text-center">{selectedUser?.name}</h3>
          <div className="flex flex-col items-center space-y-8">
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
    </>
  );
};

export default Leaderboard;

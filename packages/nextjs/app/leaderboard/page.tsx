"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { gql, request } from "graphql-request";
import type { NextPage } from "next";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FlagIcon } from "~~/components/FlagIcon";
import { Address } from "~~/components/scaffold-eth";
import { User, UserChallenge, UsersData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";
import { getFlagColor } from "~~/utils/flagColor";

const thStyles = "whitespace-nowrap px-3 py-3.5";
const tdStyles = "whitespace-nowrap px-3 py-4";

const Leaderboard: NextPage = () => {
  const fetchUsers = async () => {
    const UsersQuery = gql`
      query Users {
        users(orderBy: "sortOrder", orderDirection: "desc") {
          items {
            id
            name
            points
            challenges {
              items {
                id
                challengeId
                timestamp
              }
            }
          }
        }
      }
    `;
    const data = await request<UsersData>(process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069", UsersQuery);
    return data;
  };

  const { data: usersData } = useQuery<UsersData>({
    queryKey: ["users"],
    queryFn: fetchUsers,
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
                      <th scope="col" className={thStyles}>
                        Rank
                      </th>
                      <th scope="col" className={thStyles}>
                        Player Name
                      </th>
                      <th scope="col" className={thStyles}>
                        Address
                      </th>
                      <th scope="col" className={thStyles}>
                        Points
                      </th>
                      <th scope="col" className={thStyles}>
                        Flags Captured
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-base-100 md:text-xl">
                    {usersData.users.items.map((user: User, index: number) => (
                      <tr key={user.id}>
                        <td className={tdStyles}>{index + 1}</td>
                        <td className={tdStyles}>
                          <Link href={`/profile/${user.id}`}>
                            {user.name}
                            <ArrowTopRightOnSquareIcon
                              className="ml-2 mb-[2px] inline-block h-4 w-4"
                              aria-hidden="true"
                            />
                          </Link>
                        </td>
                        <td className={tdStyles}>
                          <Address address={user.id} size="lg" />
                        </td>
                        <td className={tdStyles}>{user.points}</td>
                        <td className={tdStyles}>
                          <div className="flex item-center gap-2">
                            {user.challenges?.items &&
                              user.challenges.items.map((challenge: UserChallenge) => (
                                <div
                                  key={challenge.id}
                                  className="relative tooltip"
                                  data-tip={getFormattedDateTime(new Date(challenge.timestamp * 1000))}
                                >
                                  <FlagIcon className={clsx("w-8 h-8", getFlagColor(challenge.challengeId))} />
                                  <p className="absolute top-[5px] left-[6px] m-0 p-0 leading-none text-xs text-white font-semibold [text-shadow:_1px_1px_1px_rgb(0_0_0_/_40%)]">
                                    {challenge.challengeId}
                                  </p>
                                </div>
                              ))}
                          </div>
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
    </div>
  );
};

export default Leaderboard;

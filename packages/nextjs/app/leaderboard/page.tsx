"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { gql, request } from "graphql-request";
import type { NextPage } from "next";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { FlagIcon } from "~~/components/FlagIcon";
import { Address } from "~~/components/scaffold-eth";
import { Team, TeamChallenge, TeamsData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";
import { getFlagColor } from "~~/utils/flagColor";

const thStyles = "whitespace-nowrap px-3 py-3.5";
const tdStyles = "whitespace-nowrap px-3 py-4";

const Leaderboard: NextPage = () => {
  const fetchTeams = async () => {
    const TeamsQuery = gql`
      query Teams {
        teams(orderBy: "sortOrder", orderDirection: "desc") {
          items {
            id
            name
            size
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
    const data = await request<TeamsData>(process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069", TeamsQuery);
    return data;
  };

  const { data: teamsData } = useQuery<TeamsData>({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  if (!teamsData) {
    return (
      <div className="flex items-center flex-col flex-grow pt-20">
        <div className="loading loading-dots loading-md"></div>
      </div>
    );
  }

  if (!teamsData.teams.items.length) {
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
                        Team Name
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
                    {teamsData.teams.items.map((team: Team, index: number) => (
                      <tr key={team.id}>
                        <td className={tdStyles}>{index + 1}</td>
                        <td className={tdStyles}>
                          <Link href={`/profile/${team.id}`}>
                            <span>{team.name}</span>
                            <span className="ml-2">
                              {[...Array(team.size)].map(() => (
                                <>👤</>
                              ))}
                            </span>
                            <ArrowTopRightOnSquareIcon
                              className="ml-2 mb-[2px] inline-block h-4 w-4"
                              aria-hidden="true"
                            />
                          </Link>
                        </td>
                        <td className={tdStyles}>
                          <Address address={team.id} size="lg" />
                        </td>
                        <td className={tdStyles}>{team.points}</td>
                        <td className={tdStyles}>
                          <div className="flex item-center gap-2">
                            {team.challenges?.items &&
                              team.challenges.items.map((challenge: TeamChallenge) => (
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

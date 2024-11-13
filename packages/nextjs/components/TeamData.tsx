"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { TeamsData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";

export const TeamData = ({ address }: { address: string }) => {
  const fetchTeam = async (teamId: string) => {
    const TeamQuery = gql`
      query Teams($teamId: String!) {
        teams(where: { id: $teamId }) {
          items {
            id
            name
            size
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
    const data = await request<TeamsData>(process.env.NEXT_PUBLIC_PONDER_URL || "http://localhost:42069", TeamQuery, {
      teamId,
    });
    return data;
  };

  const { data: teamsData } = useQuery<TeamsData>({
    queryKey: ["team", address],
    queryFn: () => fetchTeam(address || ""),
    enabled: !!address,
  });

  if (teamsData?.teams.items.length === 0) {
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
      {address && teamsData?.teams.items[0] && (
        <div>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Address:</p>
              <Address address={address} size="xl" />
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Name:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">
                <span>{teamsData.teams.items[0].name}</span>
                <span className="ml-2">
                  {[...Array(teamsData.teams.items[0].size)].map(() => (
                    <>👤</>
                  ))}
                </span>
              </p>
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Points:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">{teamsData.teams.items[0].points}</p>
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Last Updated:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">
                {getFormattedDateTime(new Date(teamsData.teams.items[0].updated * 1000))}
              </p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="font-dotGothic text-xl md:text-2xl tracking-wide">Flags Captured</h3>
            {teamsData.teams.items[0].challenges?.items && teamsData.teams.items[0].challenges?.items?.length > 0 ? (
              <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
                {teamsData.teams.items[0].challenges?.items.map(challenge => (
                  <div key={challenge.id}>
                    <div className="h-64 p-8 flex bg-gray-100 border-4 border-green-600">
                      <Image
                        src={JSON.parse(atob(challenge.tokenURI.substring(29))).image}
                        alt={`Challenge ${challenge.challengeId}`}
                        width={461}
                        height={573}
                      />
                    </div>
                    <p className="m-0 py-3 bg-green-600/30 border-4 border-t-0 border-green-600 text-gray-200 text-sm text-center">
                      {challenge.points} points @ {getFormattedDateTime(new Date(challenge.timestamp * 1000))}
                    </p>
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

"use client";

import Image from "next/image";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import teamsData from "~~/data/teamsData.json";
import tokensURIData from "~~/data/tokensURIData.json";
import { Team, TeamsData, TokensURIData } from "~~/types/utils";
import { getFormattedDateTime } from "~~/utils/date";

const typedTeamsData: TeamsData = teamsData as TeamsData;
const typedTokensURIData = tokensURIData as TokensURIData;

export const TeamData = ({ address }: { address: string }) => {
  const teamData: Team = typedTeamsData[address];

  if (!teamData) {
    return (
      <div role="alert" className="md:p-6 alert border border-green-600 rounded-none">
        <ExclamationTriangleIcon className="w-6 h-6" />
        <span className="text-lg md:text-xl">No Flags Captured</span>
      </div>
    );
  }

  return (
    <>
      {address && teamData && (
        <div>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Address:</p>
              <Address address={address} size="xl" />
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Name:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">
                <span>{teamData.name}</span>
                <span className="ml-2">
                  {[...Array(teamData.size)].map(() => (
                    <>👤</>
                  ))}
                </span>
              </p>
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Points:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">{teamData.points}</p>
            </div>
            <div>
              <p className="mb-1 md:mb-3 font-dotGothic tracking-wide">Last Updated:</p>
              <p className="mt-0 mb-0 text-xl md:text-2xl">{getFormattedDateTime(new Date(teamData.updated * 1000))}</p>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="font-dotGothic text-xl md:text-2xl tracking-wide">Flags Captured</h3>
            {teamData.challenges && teamData.challenges.length > 0 ? (
              <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
                {teamData.challenges.map(challenge => (
                  <div key={challenge.id}>
                    <div className="h-64 p-8 flex bg-gray-100 border-4 border-green-600">
                      <Image
                        src={typedTokensURIData[challenge.challengeId].image}
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

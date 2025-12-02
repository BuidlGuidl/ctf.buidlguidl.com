"use client";

import Link from "next/link";
import { ProgressInvaders } from "./ProgressInvaders";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import { getFormattedDateTime } from "~~/utils/date";
import { CHALLENGE_NAMES, SEASONS } from "~~/utils/getChallenges";

export const UserData = ({ address }: { address: string }) => {
  const { userData } = useFetchUserData({ address });

  console.log(userData);

  if (!userData) {
    return (
      <div role="alert" className="md:p-6 alert border border-green-600 rounded-none">
        <ExclamationTriangleIcon className="w-6 h-6" />
        <span className="text-lg md:text-xl">No Flags Captured</span>
        <div>
          <Link href="/bangkok/challenges/1" className="btn btn-sm btn-primary rounded-md">
            Start Challenges →
          </Link>
        </div>
      </div>
    );
  }

  const mergedChallengeDataBySeason = Object.entries(CHALLENGE_NAMES).reduce((acc, [seasonKey, challengesMap]) => {
    const season = Number(seasonKey);
    const challengeIds = Object.keys(challengesMap).sort((a, b) => Number(a) - Number(b));

    acc[season] = challengeIds.map(challengeId => {
      const userChallenge = userData.challenges?.items.find(c => {
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
  }, {} as Record<number, { challengeId: string; solved: boolean; timestamp?: number }[]>);

  return (
    <>
      {address && (
        <div className="my-4 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-x-6 gap-y-6 py-5 font-pressStart text-gray-100">
            <div>
              <Address address={address} size="xl" />
              <p className="pl-10 mt-1 mb-0">{userData.name}</p>
            </div>
            <div className="shrink-0 md:flex md:flex-col md:items-end">
              <p className="m-0 text-xl">Score: {userData.points}</p>
              <p className="mt-2 mb-0 text-xs/5 text-gray-400">
                Last Updated: {getFormattedDateTime(new Date(userData.updated * 1000))}
              </p>
            </div>
          </div>
        </div>
      )}
      {Object.entries(mergedChallengeDataBySeason)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([season, challenges]) => (
          <div key={season} className="mt-6">
            <div className="max-w-4xl mx-auto mb-2">
              <p className="m-0 text-sm text-gray-400 font-pressStart">
                {SEASONS[Number(season)]?.name ?? `Season ${season}`}
              </p>
            </div>
            <ProgressInvaders challenges={challenges} season={Number(season)} />
          </div>
        ))}
    </>
  );
};

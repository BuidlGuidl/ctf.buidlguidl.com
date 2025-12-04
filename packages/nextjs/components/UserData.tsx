"use client";

import Link from "next/link";
import { ProgressInvaders } from "./ProgressInvaders";
import { Address } from "~~/components/scaffold-eth";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import { getFormattedDateTime } from "~~/utils/date";
import { CHALLENGE_NAMES, SEASONS } from "~~/utils/getChallenges";

export const UserData = ({ address }: { address: string }) => {
  const { userData } = useFetchUserData({ address });

  const mergedChallengeDataBySeason = Object.entries(CHALLENGE_NAMES).reduce((acc, [seasonKey, challengesMap]) => {
    const season = Number(seasonKey);
    const challengeIds = Object.keys(challengesMap).sort((a, b) => Number(a) - Number(b));

    acc[season] = challengeIds.map(challengeId => {
      const userChallenge = userData?.challenges?.items.find(c => {
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
      {!userData && (
        <div className="flex justify-center my-4">
          <Link href="/bangkok/challenges/1" className="btn btn-primary rounded-md">
            Start Challenges →
          </Link>
        </div>
      )}
      {address && (
        <div className="my-4 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-x-6 gap-y-6 py-5 font-pressStart text-gray-100">
            <div>
              <Address address={address} size="xl" />
              <p className="pl-10 mt-1 mb-0">{userData?.name || "Unregistered player"}</p>
            </div>
            <div className="shrink-0 md:flex md:flex-col md:items-end">
              <p className="m-0 text-xl">Score: {userData?.points || 0}</p>
              {userData && (
                <p className="mt-2 mb-0 text-xs/5 text-gray-400">
                  Last Updated: {getFormattedDateTime(new Date(userData.updated * 1000))}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {Object.entries(mergedChallengeDataBySeason)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([season, challenges]) => (
          <div key={season} className="mt-12">
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

"use client";

import Link from "next/link";
import { ProgressInvaders } from "./ProgressInvaders";
import { Address } from "~~/components/scaffold-eth";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import { getFormattedDateTime } from "~~/utils/date";

export const UserData = ({ address, challenges }: { address: string; challenges: string[] }) => {
  const { userData } = useFetchUserData({ address });

  const mergedChallengeData = challenges.map((challengeId: string) => {
    const userChallenge = userData?.challenges?.items.find(c => c.challengeId.toString() === challengeId);

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

  return (
    <>
      {!userData && (
        <div className="flex justify-center my-6">
          <Link href="/challenge/1" className="btn btn-primary rounded-md">
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
      <ProgressInvaders challenges={mergedChallengeData} />
    </>
  );
};

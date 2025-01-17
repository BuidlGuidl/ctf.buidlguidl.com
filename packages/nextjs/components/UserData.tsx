"use client";

import Link from "next/link";
import { ProgressInvaders } from "./ProgressInvaders";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import { getFormattedDateTime } from "~~/utils/date";

export const UserData = ({ address, challenges }: { address: string; challenges: string[] }) => {
  const { userData } = useFetchUserData({ address });

  if (!userData) {
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

  const mergedChallengeData = challenges.map((challengeId: string) => {
    const userChallenge = userData.challenges?.items.find(c => c.challengeId.toString() === challengeId);

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
      <ProgressInvaders challenges={mergedChallengeData} />
    </>
  );
};

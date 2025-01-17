"use client";

import { CheckIcon } from "./CheckIcon";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { useFetchUserData } from "~~/hooks/useFetchUserData";

export function ChallengeHeading({ challengeId }: { challengeId: number }) {
  const { address } = useAccount();
  const { userData } = useFetchUserData({ address });

  const isCaptured = userData?.challenges?.items.some(challenge => Number(challenge.challengeId) === challengeId);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-5 h-5 bg-stone-700 border-2 border-stone-400 rounded-sm">
        {isCaptured && <CheckIcon className="absolute -top-2 left-0 w-6 h-6 text-primary" />}
      </div>
      <h1
        className={clsx("mb-1 text-xl leading-none font-bold font-dotGothic tracking-wide", {
          "text-white": !isCaptured,
          "text-primary": isCaptured,
        })}
      >
        Challenge #{challengeId}
      </h1>
    </div>
  );
}

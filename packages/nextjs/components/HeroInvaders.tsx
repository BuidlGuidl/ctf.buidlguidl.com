"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProgressInvaders } from "./ProgressInvaders";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import { CHALLENGE_NAMES, SEASONS, TOTAL_CHALLENGES } from "~~/utils/getChallenges";

const invaderClass = "mx-auto w-10 h-10 md:w-12 md:h-12 cursor-crosshair";
const gridClass = "mx-auto my-6 md:my-8 grid grid-cols-4 gap-4";

export function HeroInvaders() {
  const [rowOneMove, setRowOneMove] = useState("translate-x-0");
  const [rowTwoMove, setRowTwoMove] = useState("translate-x-0");
  const [rowThreeMove, setRowThreeMove] = useState("translate-x-0");

  const { address: connectedAddress } = useAccount();
  const { userData, hasCompletedChallenge1 } = useFetchUserData({ address: connectedAddress });

  // Merge challenge data with user progress (same logic as UserData)
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

  useEffect(() => {
    const interval = setInterval(() => {
      setRowOneMove(prev => {
        if (prev === "translate-x-0") {
          return "translate-x-4";
        }

        return "translate-x-0";
      });

      setRowTwoMove(prev => {
        if (prev === "translate-x-0") {
          return "-translate-x-4";
        }

        return "translate-x-0";
      });

      setRowThreeMove(prev => {
        if (prev === "translate-x-0") {
          return "translate-x-4";
        }

        return "translate-x-0";
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <div className={clsx(gridClass, rowOneMove)}>
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-1.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-2.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-3.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-4.svg" alt="" />
        </div>
        <div className={clsx(gridClass, rowTwoMove)}>
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-5.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-6.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-7.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-8.svg" alt="" />
        </div>
        <div className={clsx(gridClass, rowThreeMove)}>
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-9.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-10.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-11.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/season-1/invader-12.svg" alt="" />
        </div>
      </div>
      <div className="text-center my-12">
        {!hasCompletedChallenge1 && (
          <Link href="/bangkok/challenges/1" className="pl-8 pr-6 btn btn-primary btn-outline font-pressStart">
            Start <PlayIcon className="h-6 w-6" />
          </Link>
        )}
        {hasCompletedChallenge1 && (
          <Link href={`/profile/${connectedAddress}`} className="pl-8 pr-6 btn btn-primary btn-outline font-pressStart">
            Continue <PlayIcon className="h-6 w-6" />
          </Link>
        )}
      </div>
      <div className="mx-auto px-12 max-w-60">
        <Image width={112} height={80} className="w-full h-auto" src="/fortress-noflag.svg" alt="" />
      </div>
      <div className="mt-12 text-center">
        <h1 className="md:text-2xl font-pressStart tracking-wide leading-relaxed">Solidity Invaders</h1>
        <p className="mx-auto mt-6 text-lg md:text-xl/8">
          ALERT! Invaders have taken {TOTAL_CHALLENGES} flags from the BuidlGuidl Fortress across multiple seasons. Your
          mission is to complete Ethereum coding challenges and reclaim all of the flags. Each season brings new
          invaders and tougher challenges!
        </p>
      </div>

      {/* Challenge Grid by Season */}
      <div className="mt-16">
        {Object.entries(mergedChallengeDataBySeason)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([season, challenges]) => (
            <div key={season} className="mt-12 first:mt-0">
              <div className="max-w-4xl mx-auto mb-2">
                <p className="m-0 text-sm text-gray-400 font-pressStart">
                  {SEASONS[Number(season)]?.name ?? `Season ${season}`}
                </p>
              </div>
              <ProgressInvaders challenges={challenges} season={Number(season)} />
            </div>
          ))}
      </div>
    </>
  );
}

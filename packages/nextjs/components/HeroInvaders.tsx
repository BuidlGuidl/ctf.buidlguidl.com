"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import { CHALLENGE_DESCRIPTIONS, CHALLENGE_NAMES, SEASONS, TOTAL_CHALLENGES } from "~~/utils/getChallenges";

const invaderClass = "mx-auto w-10 h-10 md:w-12 md:h-12 cursor-crosshair";
const gridClass = "mx-auto my-6 md:my-8 grid grid-cols-4 gap-4";

export function HeroInvaders() {
  const [rowOneMove, setRowOneMove] = useState("translate-x-0");
  const [rowTwoMove, setRowTwoMove] = useState("translate-x-0");
  const [rowThreeMove, setRowThreeMove] = useState("translate-x-0");

  const { address: connectedAddress } = useAccount();
  const { hasCompletedChallenge1, challengesBySeasons } = useFetchUserData({ address: connectedAddress });

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
      {/* Hero Section with Background Invaders */}
      <div className="relative min-h-[400px] flex flex-col items-center justify-center py-12 w-full max-w-3xl">
        {/* Animated Invaders Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
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

        {/* Hero Content */}
        <div className="relative z-10">
          <div className="mx-auto px-12 max-w-60">
            <Image width={112} height={80} className="w-full h-auto" src="/fortress-noflag.svg" alt="" />
          </div>
          <div className="mt-8 text-center">
            <h1 className="md:text-2xl font-pressStart tracking-wide leading-relaxed">Solidity Invaders</h1>
            <p className="mt-6 text-lg md:text-xl/8">
              ALERT! Invaders have taken {TOTAL_CHALLENGES} flags from the BuidlGuidl Fortress across multiple seasons.
              Your mission is to complete Ethereum coding challenges and reclaim all of the flags. Each season brings
              new invaders and tougher challenges!
            </p>
          </div>
          {/* Start/Continue Button */}
          <div className="text-center mt-8">
            {!hasCompletedChallenge1 && (
              <Link href="/bangkok/challenges/1" className="pl-8 pr-6 btn btn-primary btn-outline font-pressStart">
                Start <PlayIcon className="h-6 w-6" />
              </Link>
            )}
            {hasCompletedChallenge1 && (
              <Link
                href={`/profile/${connectedAddress}`}
                className="pl-8 pr-6 btn btn-primary btn-outline font-pressStart"
              >
                Continue <PlayIcon className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Challenge Grid - 2 Columns (1 per season) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {Object.entries(challengesBySeasons)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([season, challenges]) => (
            <div key={season}>
              <p className="m-0 mb-4 text-sm text-gray-400 font-pressStart">
                {SEASONS[Number(season)]?.name ?? `Season ${season}`}
              </p>
              <div className="space-y-2">
                {challenges.map(challenge => {
                  const seasonNum = Number(season);
                  const challengeId = Number(challenge.challengeId);
                  const slug = SEASONS[seasonNum]?.slug ?? "bangkok";
                  const description = CHALLENGE_DESCRIPTIONS[seasonNum]?.[challenge.challengeId] ?? "";
                  return (
                    <div key={challenge.challengeId} className="tooltip tooltip-top w-full" data-tip={description}>
                      <Link
                        href={`/${slug}/challenges/${challengeId}`}
                        className={clsx(
                          "flex items-center gap-3 p-2 rounded-md hover:bg-gray-900 transition-colors",
                          challenge.solved && "bg-gray-900/50",
                        )}
                      >
                        <Image
                          width={32}
                          height={32}
                          className="w-8 h-8 shrink-0"
                          src={`/season-${season}/invader-${challengeId}.svg`}
                          alt=""
                        />
                        <span className={clsx("text-sm", challenge.solved && "text-primary")}>
                          {CHALLENGE_NAMES[seasonNum]?.[challenge.challengeId] ?? `Challenge ${challengeId}`}
                        </span>
                        {challenge.solved && <span className="text-primary text-xs ml-auto">✓</span>}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      {/* Telegram CTA */}
      <div className="mt-16 text-center">
        <p className="text-gray-400 mb-4">Got questions or need help?</p>
        <a
          href="https://t.me/+B9dXIETeXBswOWYy"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
        >
          Join our Telegram
        </a>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useAccount } from "wagmi";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useFetchUserData } from "~~/hooks/useFetchUserData";

const invaderClass = "mx-auto w-10 h-10 md:w-12 md:h-12 cursor-crosshair";
const gridClass = "mx-auto my-6 md:my-8 grid grid-cols-4 gap-4";

export function HeroInvaders() {
  const [rowOneMove, setRowOneMove] = useState("translate-x-0");
  const [rowTwoMove, setRowTwoMove] = useState("translate-x-0");
  const [rowThreeMove, setRowThreeMove] = useState("translate-x-0");

  const { address: connectedAddress } = useAccount();
  const { hasCompletedChallenge1 } = useFetchUserData({ address: connectedAddress });

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
          <Image width={96} height={96} className={invaderClass} src="/invader-1.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-2.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-3.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-4.svg" alt="" />
        </div>
        <div className={clsx(gridClass, rowTwoMove)}>
          <Image width={96} height={96} className={invaderClass} src="/invader-5.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-6.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-7.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-8.svg" alt="" />
        </div>
        <div className={clsx(gridClass, rowThreeMove)}>
          <Image width={96} height={96} className={invaderClass} src="/invader-9.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-10.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-11.svg" alt="" />
          <Image width={96} height={96} className={invaderClass} src="/invader-12.svg" alt="" />
        </div>
      </div>
      <div className="text-center my-12">
        {!hasCompletedChallenge1 && (
          <Link href="/challenge/1" className="pl-8 pr-6 btn btn-primary btn-outline font-pressStart">
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
          ALERT! Invaders have taken 12 flags from the BuidlGuidl Fortress. Your mission is to complete Ethereum coding
          challenges and take the flags back.
        </p>
      </div>
    </>
  );
}

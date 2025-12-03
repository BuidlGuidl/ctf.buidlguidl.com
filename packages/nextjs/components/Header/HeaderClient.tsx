"use client";

import Image from "next/image";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import scaffoldConfig from "~~/scaffold.config";
import { SEASONS, TOTAL_CHALLENGES } from "~~/utils/getChallenges";

/**
 * Site header
 */
export const HeaderClient = () => {
  const currentChain = scaffoldConfig.targetNetworks[0];

  const { address: connectedAddress } = useAccount();

  const { userData } = useFetchUserData({ address: connectedAddress });

  const baseFlagsCaptured = userData?.challenges?.items.length || 0;
  const numberOfSeasons = Object.keys(SEASONS).length;

  // If challenge #1 is completed, it counts for all seasons (add seasons - 1 to the count)
  const flagsCaptured = baseFlagsCaptured > 0 ? baseFlagsCaptured + (numberOfSeasons - 1) : baseFlagsCaptured;

  return (
    <>
      <div className="py-4 px-4 flex justify-between lg:grid lg:grid-cols-3 items-center z-20 relative">
        <div>
          <div className="text-white text-sm font-pressStart">
            <Link className="flex items-center gap-4" href="/">
              <Image alt="BuidlGuidl" className="w-8" src="/fortress-flag.svg" width={112} height={128} />
              <span className="mt-2 hidden lg:inline">BuidlGuidl CTF</span>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block text-center">
          {connectedAddress && (
            <Link
              href={`/profile/${connectedAddress}`}
              className="text-white text-sm font-pressStart link-hover hover:text-primary"
            >
              My Flags: {flagsCaptured}/{TOTAL_CHALLENGES}
            </Link>
          )}
        </div>
        <div className="flex">
          <div className="ml-auto flex">
            <RainbowKitCustomConnectButton />
            {(currentChain?.id as number) === hardhat.id && <FaucetButton />}
          </div>
        </div>
      </div>
      <div className="text-center lg:hidden">
        {connectedAddress && (
          <Link
            href={`/profile/${connectedAddress}`}
            className="text-white text-sm font-pressStart link-hover hover:text-primary"
          >
            My Flags: {flagsCaptured}/{TOTAL_CHALLENGES}
          </Link>
        )}
      </div>
    </>
  );
};

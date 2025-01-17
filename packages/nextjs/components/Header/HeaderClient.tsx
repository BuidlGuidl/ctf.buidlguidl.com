"use client";

import { ReactNode, useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useFetchUserData } from "~~/hooks/useFetchUserData";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Site header
 */
export const HeaderClient = ({ menuLinks }: { menuLinks: ReactNode }) => {
  const currentChain = scaffoldConfig.targetNetworks[0];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const { address: connectedAddress } = useAccount();

  const { userData } = useFetchUserData({ address: connectedAddress });

  const flagsCaptured = userData?.challenges?.items.length || 0;

  return (
    <div className="py-4 px-4 flex justify-between lg:grid lg:grid-cols-3 items-center z-20 relative">
      <div className="">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className="btn btn-ghost px-3"
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="w-6 h-6" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact gap-1 dropdown-content mt-3 p-2 bg-base-100 rounded-md w-52 border border-secondary"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {menuLinks}
            </ul>
          )}
        </div>
        <div className="hidden lg:block text-white text-sm font-pressStart">
          <Link className="flex items-center gap-4" href="/">
            <Image alt="BuidlGuidl" className="w-8" src="/fortress-flag.svg" width={112} height={128} />
            <span className="mt-2">BuidlGuidl CTF</span>
          </Link>
        </div>
      </div>
      <div className="hidden lg:block text-center">
        {connectedAddress && (
          <Link
            href={`/profile/${connectedAddress}`}
            className="text-white text-sm font-pressStart link-hover hover:text-primary"
          >
            My Flags: {flagsCaptured}/12
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
  );
};

"use client";

import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";
import { BuidlGuidlLogo } from "~~/components/assets/BuidlGuidlLogo";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";

/**
 * Site footer
 */
export const Footer = () => {
  useInitializeNativeCurrencyPrice();

  return (
    <div className="min-h-0 py-5 px-1 sm:mb-11 lg:mb-0">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 text-sm w-full">
            <div className="text-center">
              <Link href="/faqs" className="link">
                FAQs
              </Link>
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="flex justify-center items-center gap-2">
              <p className="m-0 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4" /> at
              </p>
              <a
                className="flex justify-center items-center gap-1"
                href="https://buidlguidl.com/"
                target="_blank"
                rel="noreferrer"
              >
                <BuidlGuidlLogo className="w-3 h-5 pb-1" />
                <span className="link">BuidlGuidl</span>
              </a>
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="text-center">
              <a
                href="https://github.com/buidlguidl/ctf.buidlguidl.com"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                Fork me
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

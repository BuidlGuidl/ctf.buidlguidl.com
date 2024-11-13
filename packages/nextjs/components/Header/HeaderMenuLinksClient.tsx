"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubMenu } from "./SubMenu";
import { MenuLink } from "./types";
import { useAccount } from "wagmi";
import { UserIcon } from "@heroicons/react/24/outline";

export const HeaderMenuLinksClient = ({ menuLinks }: { menuLinks: MenuLink[] }) => {
  const pathname = usePathname();
  const { address: connectedAddress } = useAccount();

  const finalMenuLinks = [
    // Add profile link if there is a connected address
    ...(connectedAddress
      ? [
          {
            label: "Profile",
            href: `/profile/${connectedAddress}`,
            icon: <UserIcon className="h-4 w-4" />,
          },
        ]
      : []),
    ...menuLinks,
  ] as MenuLink[];

  return (
    <>
      {finalMenuLinks.map(({ label, href, icon, sublinks }) => {
        const isActive = pathname === href || (sublinks && sublinks.some(sublink => pathname === sublink.href));
        const hasSublinks = sublinks && sublinks.length > 0;

        return (
          <li key={label} className={`relative ${hasSublinks ? "dropdown" : ""}`}>
            {hasSublinks ? (
              <SubMenu label={label} icon={icon} sublinks={sublinks} isActive={Boolean(isActive)} />
            ) : (
              <Link
                href={href}
                passHref
                className={`${
                  isActive ? "bg-secondary shadow-md" : ""
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary py-1.5 px-3 text-sm rounded-md gap-2 grid grid-flow-col`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </>
  );
};

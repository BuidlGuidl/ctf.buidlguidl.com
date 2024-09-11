"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SubMenu } from "./SubMenu";
import { MenuLink } from "./types";

export const HeaderMenuLinksClient = ({ menuLinks }: { menuLinks: MenuLink[] }) => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon, sublinks }) => {
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
                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
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

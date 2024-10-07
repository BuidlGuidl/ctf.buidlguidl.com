"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuLink } from "./types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

interface SubMenuProps {
  label: string;
  icon: React.ReactNode;
  sublinks: MenuLink[];
  isActive: boolean;
}

export const SubMenu: React.FC<SubMenuProps> = ({ label, icon, sublinks, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  useOutsideClick(buttonRef, () => {
    setIsOpen(false);
  });

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleDropdownToggle}
        className={`${
          isActive ? "bg-secondary shadow-md" : ""
        } max-lg:hidden btn btn-sm w-full bg-base-100 lg:w-auto max-lg:justify-start hover:bg-secondary hover:shadow-md focus:!bg-secondary py-1 px-3 text-sm rounded-md h-full gap-2 border-0`}
      >
        {icon}
        <span>{label}</span>
        <ChevronDownIcon className={`h-6 w-4 ml-2 sm:ml-0 transition-transform duration-200`} />
      </button>
      <ul
        className={`${
          isOpen ? "dropdown-content" : "lg:hidden"
        } lg:absolute dropdown-end ml-0 menu lg:w-40 z-[2] px-0 py-0 lg:p-2 lg:mt-2 bg-base-200 lg:rounded-md gap-1 lg:border lg:border-secondary`}
      >
        {sublinks.map(sublink => (
          <li key={sublink.href} className="ml-0">
            <Link
              href={sublink.href}
              className={`block px-3 lg:px-4 py-1.5 text-sm rounded-md hover:bg-secondary focus:!bg-secondary ${
                pathname === sublink.href ? "bg-secondary" : ""
              }`}
              onClick={handleLinkClick}
            >
              {sublink.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

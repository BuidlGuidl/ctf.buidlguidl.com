import { ReactNode } from "react";

export type MenuLink = {
  label: string;
  href: string;
  icon?: ReactNode;
  sublinks?: MenuLink[];
};

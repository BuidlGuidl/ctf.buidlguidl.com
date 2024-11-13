import { HeaderMenuLinksClient } from "./HeaderMenuLinksClient";
import { MenuLink } from "./types";
import fs from "fs/promises";
import path from "path";
import { AcademicCapIcon, BellAlertIcon, BugAntIcon } from "@heroicons/react/24/outline";

async function getChallenges() {
  const challengesDir = path.join(process.cwd(), "data", "challenges");
  const files = await fs.readdir(challengesDir);
  const challenges = files.map(file => path.parse(file).name).sort((a, b) => Number(a) - Number(b));

  return challenges.map(challenge => ({
    label: `Challenge ${challenge}`,
    href: `/challenge/${challenge}`,
  }));
}

export const HeaderMenuLinks = async () => {
  const challenges = await getChallenges();

  const menuLinks: MenuLink[] = [
    {
      label: "Challenges",
      href: "#",
      icon: <BellAlertIcon className="h-4 w-4" />,
      sublinks: challenges,
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      icon: <AcademicCapIcon className="h-4 w-4" />,
    },
    {
      label: "Debug Contracts",
      href: "/debug",
      icon: <BugAntIcon className="h-4 w-4" />,
    },
  ];

  return <HeaderMenuLinksClient menuLinks={menuLinks} />;
};

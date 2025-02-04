import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Stats",
  description: "Check out the stats for the BuidlGuidl CTF",
});

export default function StatsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

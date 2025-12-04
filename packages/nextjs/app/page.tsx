import type { NextPage } from "next";
import { HeroInvaders } from "~~/components/HeroInvaders";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "BuidlGuidl CTF",
  description:
    "BuidlGuidl Capture The Flag - Test out your Ethereum development skills by completing fun coding challenges!",
});

const Home: NextPage = () => {
  return (
    <div className="pt-4 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        <HeroInvaders />
      </div>
    </div>
  );
};

export default Home;

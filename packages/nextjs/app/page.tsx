import Link from "next/link";
import type { NextPage } from "next";
import { ClockIcon, FlagIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";
import { FlagArt } from "~~/components/FlagArt";
import { UserData } from "~~/components/UserData";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const rules = [
  {
    name: "NFT Flags",
    description: "A NFT flag will be minted to your connected wallet when a challenge is completed.",
    icon: FlagIcon,
  },
  {
    name: "Time Limit: X Hours",
    description: "The game will last for X hours. The player with the most flags at the end of game will win.",
    icon: ClockIcon,
  },
  {
    name: "Tie Breaker",
    description: "If two or more players have the same number of flags, the player who captured the flag earlier wins.",
    icon: RocketLaunchIcon,
  },
];

export const metadata = getMetadata({
  title: "BuidlGuidl CTF",
  description: "Devcon SEA 2024",
});

const Home: NextPage = () => {
  return (
    <>
      <div className="pt-16 bg-[url(/dot-texture.svg)]">
        <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <h1 className="font-dotGothic tracking-wide">
              <span className="block text-xl mb-2 md:text-2xl md:mb-4">- Devcon SEA 2024 -</span>
              <span className="block text-3xl md:text-4xl">BuidlGuidl Capture The Flag</span>
            </h1>
            <p className="mt-6 leading-relaxed md:leading-8 text-gray-50">
              Greetings Player. Welcome to the BuidlGuidl CTF (Capture The Flag) Game. There will be a total of XX
              coding challenges to test your Ethereum development skills. Upon completion of a challenge, you shall
              receive a NFT flag. The player with the most flags wins. Good Luck...
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/challenge/1" className="btn btn-primary rounded-md">
                Start Challenges →
              </Link>
              <a href="#rules" className="btn btn-primary btn-outline rounded-md">
                Learn More
              </a>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <FlagArt />
          </div>
        </div>
        <div className="mt-20 flex flex-col">
          <div className="ml-auto bg-green-600 h-8 w-[20%] opacity-20"></div>
          <div className="ml-auto bg-green-600 h-8 w-[40%] opacity-40"></div>
          <div className="ml-auto bg-green-600 h-8 w-[60%] opacity-60"></div>
          <div className="ml-auto bg-green-600 h-8 w-[80%] opacity-80"></div>
          <div className="bg-green-600 h-8 w-[100%] opacity-90"></div>
        </div>
      </div>
      <div id="rules" className="bg-green-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold font-dotGothic tracking-wide text-white md:text-4xl">
              Choose Your Own Adventure
            </h2>
            <p className="mt-6 leading-relaxed text-gray-100 md:leading-8 md:text-lg">
              Challenges will become more difficult as you progress. Beginners are encouraged to use this Scaffold ETH 2
              repository to solve the challenges. Advanced players may use any means necessary to progress.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {rules.map(rule => (
                <div key={rule.name} className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-green-800">
                      <rule.icon aria-hidden="true" className="h-6 w-6 text-white" />
                    </div>
                    {rule.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-gray-100">
                    <p className="flex-auto">{rule.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <UserData />
        </div>
      </div>
    </>
  );
};

export default Home;

import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "BuidlGuidl CTF",
  description: "Devcon SEA 2024",
});

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">BuidlGuidl CTF - Devcon SEA 2024</span>
          </h1>
          <div className="max-w-3xl mx-auto mt-8 mb-8 text-base-content">
            <p>Things to mention:</p>
            <ul className="list-disc list-inside">
              <li>Welcome text</li>
              <li>
                TLDR of the game: There are X challenges, NFT contract: each challenge is a NFT flag minted, player with
                more flags wins (faster one wins if tie). Check leaderboard.
              </li>
              <li>Two recomended options for the set up / playing the game</li>
              <li className="list-none">
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Option 1 (begginers / intermediate builders / not strong opinions): Use this SE-2 repo, that has
                    everything you need to solve the challenges (hardhat / foundry / scripting with viem)
                  </li>
                  <li>Option 2 (advanced): Use your own stack. Check the challenges on the menu</li>
                </ul>
              </li>
              <li>Extra info: ask questions (there will be mentors in the room, etc)...</li>
              <li>Prize info: TBD</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

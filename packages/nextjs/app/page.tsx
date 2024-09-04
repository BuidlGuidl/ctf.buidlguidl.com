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
          <p>............text............</p>
        </div>
      </div>
    </>
  );
};

export default Home;

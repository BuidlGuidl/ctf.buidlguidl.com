import type { NextPage } from "next";
import { FlagArt } from "~~/components/FlagArt";
import { UserData } from "~~/components/UserData";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

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
              <span className="block text-3xl md:text-4xl font-bold">BuidlGuidl Capture The Flag</span>
            </h1>
            <p className="mt-6 leading-relaxed md:leading-8 text-gray-50">
              Greetings Player. Welcome to the BuidlGuidl CTF (Capture The Flag) Game. There will be a total of XX
              coding challenges to test your Ethereum development skills. Upon completion of a challenge, you shall
              receive a NFT flag. The player with the most flags wins. Good Luck...
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a href="#" className="btn btn-primary rounded-md">
                Get Started →
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
        <UserData />
      </div>
      <div className="h-48 bg-green-600"></div>
    </>
  );
};

export default Home;

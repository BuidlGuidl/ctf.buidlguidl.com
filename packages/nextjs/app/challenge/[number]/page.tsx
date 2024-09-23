import { notFound } from "next/navigation";
import clsx from "clsx";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import { Address } from "~~/components/scaffold-eth";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

interface ChallengePageProps {
  params: {
    number: string;
  };
}

const borderStyles = "absolute border-green-400 h-3 w-3";

export async function generateMetadata({ params }: ChallengePageProps) {
  return getMetadata({
    title: `Challenge #${params.number}`,
    description: "Devcon SEA 2024",
  });
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { number } = params;
  const challengePath = path.join(process.cwd(), "data", "challenges", `${number}.md`);

  let content;
  try {
    content = await fs.promises.readFile(challengePath, "utf8");
  } catch (error) {
    notFound();
  }

  return (
    <div className="py-20 px-6 min-h-screen bg-[url(/dot-texture.svg)]">
      <div className="max-w-3xl mx-auto bg-base-100 border-2 border-t-4 border-l-4 border-green-700 border-t-green-600 border-l-green-500">
        <div className="px-6 py-2 bg-green-600/30 border-b border-green-600">
          <h1 className="mt-[3px] text-white text-xl leading-none font-bold font-dotGothic tracking-wide">
            &gt; Challenge #{number}
            <span className="ml-1 animate-pulse">_</span>
          </h1>
        </div>
        <div className="px-6 py-8">
          <div className="mb-8 p-2 relative w-72 flex justify-center items-center font-dotGothic">
            <div className={clsx(borderStyles, "top-0 left-0 border-t border-l")}></div>
            <div className={clsx(borderStyles, "top-0 right-0 border-t border-r")}></div>
            <div className={clsx(borderStyles, "bottom-0 left-0 border-b border-l")}></div>
            <div className={clsx(borderStyles, "bottom-0 right-0 border-b border-r")}></div>
            {/* TODO: fetch the contract address (some challenges might not have one (e.g. offchain backend challenges)) */}
            <span className="mr-3 hidden md:inline-block">Contract:</span>{" "}
            <Address address="0x0000000000000000000000000000000000000000" />
          </div>

          {/* Format the Markdown (bold, titles, etc) */}
          <div className="prose text-gray-50 prose-headings:font-dotGothic prose-headings:tracking-wide prose-h1:text-3xl">
            <MDXRemote source={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

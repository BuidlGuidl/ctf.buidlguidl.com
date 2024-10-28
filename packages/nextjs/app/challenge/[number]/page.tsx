import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeContractAddress } from "../_components/ChallengeContractAddress";
import clsx from "clsx";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import { FlagIcon } from "~~/components/FlagIcon";
import { getFlagColor } from "~~/utils/flagColor";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

interface ChallengePageProps {
  params: {
    number: string;
  };
}

export async function generateMetadata({ params }: ChallengePageProps) {
  return getMetadata({
    title: `Challenge #${params.number}`,
    description: "Devcon SEA 2024",
  });
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { number: challengeNumberString } = params;
  const challengeNumber = Number(challengeNumberString);
  const challengesDir = path.join(process.cwd(), "data", "challenges");
  const challengePath = path.join(challengesDir, `${challengeNumber}.md`);

  const totalChallenges = (await fs.promises.readdir(challengesDir)).length;

  let content;
  try {
    content = await fs.promises.readFile(challengePath, "utf8");
  } catch (error) {
    notFound();
  }

  return (
    <div className="py-20 px-6 min-h-screen bg-[url(/dot-texture.svg)]">
      <div className="max-w-3xl mx-auto bg-base-100 border-2 border-t-4 border-l-4 border-green-700 border-t-green-600 border-l-green-500">
        <div className="flex justify-between px-6 py-2 bg-green-600/30 border-b border-green-600">
          <h1 className="mt-[3px] text-white text-xl leading-none font-bold font-dotGothic tracking-wide">
            &gt; Challenge #{challengeNumber}
          </h1>
          <div className="relative">
            <FlagIcon className={clsx("w-8 h-8", getFlagColor(challengeNumber))} />
            <p className="absolute top-[5px] left-[6px] m-0 p-0 leading-none text-xs text-white font-semibold [text-shadow:_1px_1px_1px_rgb(0_0_0_/_40%)]">
              {challengeNumber}
            </p>
          </div>
        </div>
        <div className="px-6 py-8">
          <div className="prose max-w-none text-gray-50 prose-headings:font-dotGothic prose-headings:tracking-wide prose-h1:text-3xl">
            <MDXRemote source={content} />
          </div>

          <ChallengeContractAddress challengeNumber={challengeNumber} />
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex justify-between">
          {challengeNumber > 1 && (
            <Link
              className="btn btn-sm btn-primary btn-outline rounded-none"
              href={`/challenge/${challengeNumber - 1}`}
            >
              &larr; Previous Challenge
            </Link>
          )}
          {challengeNumber < totalChallenges && (
            <Link
              className="ml-auto btn btn-sm btn-primary btn-outline rounded-none"
              href={`/challenge/${challengeNumber + 1}`}
            >
              Next Challenge &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

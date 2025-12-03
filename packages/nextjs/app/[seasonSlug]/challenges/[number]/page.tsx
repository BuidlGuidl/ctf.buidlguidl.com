import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChallengeContractAddress } from "../../../../components/ChallengeContractAddress";
import clsx from "clsx";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import { ChallengeHeading } from "~~/components/ChallengeHeading";
import { FlagIcon } from "~~/components/FlagIcon";
import { getFlagColor } from "~~/utils/flagColor";
import { SEASONS, getSeasonBySlug, getSlugBySeason } from "~~/utils/getChallenges";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

// Custom components for MDX
const components = {
  a: (props: any) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

const TOTAL_CHALLENGES_PER_SEASON = 12;

interface ChallengePageProps {
  params: {
    number: string;
    seasonSlug: string;
  };
}

export async function generateMetadata({ params }: ChallengePageProps) {
  const season = getSeasonBySlug(params.seasonSlug);
  if (!season) {
    return getMetadata({
      title: `Challenge #${params.number}`,
      description: "BuidlGuidl CTF",
    });
  }
  return getMetadata({
    title: `Season ${season} - ${SEASONS[season]?.name} - Challenge #${params.number}`,
    description: "BuidlGuidl CTF",
  });
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { number: challengeNumberString } = params;
  const challengeNumber = Number(challengeNumberString);
  const season = getSeasonBySlug(params.seasonSlug);

  if (!season) {
    notFound();
  }
  const challengesRootDir = path.join(process.cwd(), "data", "challenges");
  const challengesDir = path.join(challengesRootDir, `season${season}`);
  const challengePath = path.join(challengesDir, `${challengeNumber}.md`);

  const totalChallenges = TOTAL_CHALLENGES_PER_SEASON;

  // Determine available seasons from SEASONS config
  const seasonNumbers = Object.keys(SEASONS)
    .map(Number)
    .sort((a, b) => a - b);

  const currentSeasonIndex = seasonNumbers.indexOf(season);

  // Previous challenge (may be in previous season)
  let prevSeason: number | null = null;
  let prevChallengeNumber: number | null = null;

  if (challengeNumber > 1) {
    prevSeason = season;
    prevChallengeNumber = challengeNumber - 1;
  } else if (currentSeasonIndex > 0) {
    const previousSeason = seasonNumbers[currentSeasonIndex - 1];
    prevSeason = previousSeason;
    prevChallengeNumber = TOTAL_CHALLENGES_PER_SEASON;
  }

  // Next challenge (may be in next season)
  let nextSeason: number | null = null;
  let nextChallengeNumber: number | null = null;

  if (challengeNumber < totalChallenges) {
    nextSeason = season;
    nextChallengeNumber = challengeNumber + 1;
  } else if (currentSeasonIndex >= 0 && currentSeasonIndex < seasonNumbers.length - 1) {
    const upcomingSeason = seasonNumbers[currentSeasonIndex + 1];
    nextSeason = upcomingSeason;
    nextChallengeNumber = 1;
  }

  let content;
  try {
    content = await fs.promises.readFile(challengePath, "utf8");
  } catch (error) {
    notFound();
  }

  return (
    <div className="py-14 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto bg-base-100 border-2 border-t-4 border-l-4 border-green-700 border-t-green-600 border-l-green-500">
        <div className="flex items-center justify-between px-6 bg-green-600/30 border-b border-green-600">
          <ChallengeHeading challengeId={challengeNumber} season={season} />
          <div className="ml-auto mt-2 mr-2 relative w-10 text-center">
            <Image
              width={96}
              height={96}
              className="mx-auto w-10 h-10 md:w-12 md:h-12"
              src={`/season-${season}/invader-${challengeNumber}.svg`}
              alt={`Invader Season ${season} - Challenge ${challengeNumber}`}
            />
            <div className="absolute top-0 -right-7">
              <div className="relative rotate-12">
                <FlagIcon className={clsx("w-8 h-8", getFlagColor(challengeNumber))} />
                <p className="absolute top-[5px] left-[6px] m-0 p-0 leading-none text-xs text-white font-semibold [text-shadow:_1px_1px_1px_rgb(0_0_0_/_40%)]">
                  {challengeNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-8">
          <div className="prose max-w-none text-gray-50 prose-headings:font-dotGothic prose-headings:tracking-wide prose-h1:text-3xl">
            <MDXRemote source={content} components={components} />
          </div>

          <ChallengeContractAddress challengeNumber={challengeNumber} season={season} />
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex justify-between">
          {prevSeason !== null && prevChallengeNumber !== null && (
            <Link
              className="btn btn-sm btn-primary btn-outline rounded-none"
              href={`/${getSlugBySeason(prevSeason)}/challenges/${prevChallengeNumber}`}
            >
              &larr; Previous Challenge
            </Link>
          )}
          {nextSeason !== null && nextChallengeNumber !== null && (
            <Link
              className="ml-auto btn btn-sm btn-primary btn-outline rounded-none"
              href={`/${getSlugBySeason(nextSeason)}/challenges/${nextChallengeNumber}`}
            >
              Next Challenge &rarr;
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

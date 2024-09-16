import { notFound } from "next/navigation";
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl md:text-4xl font-bold font-dotGothic tracking-wide">Challenge {number}</h1>
      <div className="prose prose-invert">
        <div className="mb-6">
          {/* TODO: fetch the contract address (some challenges might not have one (e.g. offchain backend challenges)) */}
          <Address address="0x0000000000000000000000000000000000000000" />
        </div>
        {/* Format the Markdown (bold, titles, etc) */}
        <MDXRemote source={content} />
      </div>
    </div>
  );
}

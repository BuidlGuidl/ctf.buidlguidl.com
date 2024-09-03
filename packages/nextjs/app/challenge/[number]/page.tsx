import { notFound } from "next/navigation";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

interface ChallengePageProps {
  params: {
    number: string;
  };
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
      <h1 className="text-3xl font-bold mb-4">Challenge {number}</h1>
      <div className="prose prose-invert">
        <MDXRemote source={content} />
      </div>
    </div>
  );
}

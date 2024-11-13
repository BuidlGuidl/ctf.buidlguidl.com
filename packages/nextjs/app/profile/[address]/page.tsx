import { TeamData } from "~~/components/TeamData";

interface ProfilePageProps {
  params: {
    address: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { address } = params;

  return (
    <div className="py-20 px-6 min-h-screen bg-[url(/dot-texture.svg)]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-dotGothic tracking-wide md:text-4xl">Team Profile</h1>
        <div className="mt-8 md:mt-12">
          <TeamData address={address} />
        </div>
      </div>
    </div>
  );
}

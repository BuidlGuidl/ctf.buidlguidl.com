import Image from "next/image";
import { UserData } from "~~/components/UserData";
import { getChallenges } from "~~/utils/getChallenges";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

interface ProfilePageProps {
  params: {
    address: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { address } = params;
  const displayAddress = address?.slice(0, 4) + "..." + address?.slice(-4);
  return getMetadata({
    title: `${displayAddress} Profile`,
    description: `Check out ${address} progress in the BuidlGuidl CTF`,
  });
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { address } = params;
  const challenges = await getChallenges();

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto px-12 max-w-60">
          <Image width={112} height={80} className="w-full h-auto" src="/fortress-noflag.svg" alt="" />
        </div>
        <div className="mt-8 text-center">
          <h1 className="md:text-2xl font-pressStart tracking-wide leading-relaxed">Player Progress</h1>
        </div>
        <div className="mt-8 md:mt-12">
          <UserData address={address} challenges={challenges} />
        </div>
      </div>
    </div>
  );
}

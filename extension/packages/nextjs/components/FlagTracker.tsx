"use client";

import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

export const FlagTracker = () => {
  const { address: connectedAddress } = useAccount();
  const { data: userFlagsSeason1 } = useScaffoldEventHistory({
    contractName: "Season1NFTFlags",
    eventName: "FlagMinted",
    // Set the block number to the first block of the network where the contract was deployed
    fromBlock: (scaffoldConfig.targetNetworks[0].id as number) === hardhat.id ? 0n : BigInt(scaffoldConfig.startBlockSeason1),
    watch: true,
    filters: {
      minter: connectedAddress,
    },
    enabled: !!connectedAddress,
  });

  const { data: userFlagsSeason2 } = useScaffoldEventHistory({
    contractName: "Season2NFTFlags",
    eventName: "FlagMinted",
    // Set the block number to the first block of the network where the contract was deployed
    fromBlock: (scaffoldConfig.targetNetworks[0].id as number) === hardhat.id ? 0n : BigInt(scaffoldConfig.startBlockSeason2),
    watch: true,
    filters: {
      minter: connectedAddress,
    },
    enabled: !!connectedAddress,
  });

  const userRegistered = userFlagsSeason1?.length > 0;

  const userMintedSeason1ChallengeIds = new Set(userFlagsSeason1?.map(event => event?.args?.challengeId?.toString()) || []);
  const userMintedSeason2ChallengeIds = new Set(userFlagsSeason2?.map(event => event?.args?.challengeId?.toString()) || []);

  const allChallengeIds = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  const remainingFlagsSeason1 = allChallengeIds.filter(id => !userMintedSeason1ChallengeIds.has(id));
  const remainingFlagsSeason2 = allChallengeIds.filter(id => id === "1" ? !userMintedSeason1ChallengeIds.has(id) : !userMintedSeason2ChallengeIds.has(id));

  if (!connectedAddress) {
    return (
      <div className="bg-base-100 p-6 rounded-lg shadow-md">Connect your wallet to view your collected flags.</div>
    );
  }

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Flag Tracker 🚩</h2>
      <p className="text-sm text-base-content/70 mb-4">Track your progress in capturing all 24 flags.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Your Captured Flags</h3>

          {(!userRegistered) ? (
            <p className="text-sm text-base-content/70">No flags captured yet. Start solving challenges!</p>
          ) : (
            <>
              <div className="mb-4">
                <div className="text-lg font-semibold mb-2">Season 1</div>
                <div className="space-y-2">
                  {userFlagsSeason1?.map(event => (
                    <div
                      key={event?.args?.tokenId?.toString()}
                      className="flex items-center space-x-2 bg-success/20 p-2 rounded"
                    >
                      <span className="text-success">✓</span>
                      <span>
                        Flag #{event?.args?.challengeId?.toString()} (Token ID: {event?.args?.tokenId?.toString()})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-lg font-semibold mb-2">Season 2</div>
                <div className="space-y-2">
                  <>
                    {userFlagsSeason2?.map(event => {
                      return <div
                        key={event?.args?.tokenId?.toString()}
                        className="flex items-center space-x-2 bg-success/20 p-2 rounded"
                      >
                        <span className="text-success">✓</span>
                        <span>
                          Flag #{event?.args?.challengeId?.toString()} (Token ID: {event?.args?.tokenId?.toString()})
                        </span>
                      </div>
                    })}
                    <div className="flex items-center space-x-2 bg-success/20 p-2 rounded">
                      <span className="text-success">✓</span>
                      <span> Flag #1</span>
                    </div>
                  </>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Remaining Flags</h3>
          <div className="space-y-2">
            {remainingFlagsSeason1.length > 0 || remainingFlagsSeason2.length > 0 ? (
              <>
                {remainingFlagsSeason1.length > 0 && (
                  <>
                    <div className="text-lg font-semibold mb-2">Season 1</div>
                    {remainingFlagsSeason1.map(challengeId => (
                      <div key={challengeId} className="flex items-center space-x-2 bg-base-200 p-2 rounded">
                        <span>○</span>
                        <span>Flag #{challengeId}</span>
                      </div>
                    ))}
                  </>
                )}
                {remainingFlagsSeason2.length > 0 && (
                  <>
                    <div className="text-lg font-semibold mb-2 mt-4">Season 2</div>
                    {remainingFlagsSeason2.map(challengeId => (
                      <div key={challengeId} className="flex items-center space-x-2 bg-base-200 p-2 rounded">
                        <span>○</span>
                        <span>Flag #{challengeId}</span>
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-base-content/70">Congratulations! You&apos;ve captured all flags! 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

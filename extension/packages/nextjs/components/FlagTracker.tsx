"use client";

import { useAccount } from "wagmi";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

export const FlagTracker = () => {
  const { address: connectedAddress } = useAccount();
  const { data: userFlags } = useScaffoldEventHistory({
    contractName: "NFTFlags",
    eventName: "FlagMinted",
    fromBlock: 0n,
    watch: true,
    filters: {
      minter: connectedAddress,
    },
  });

  const userMintedChallengeIds = new Set(userFlags?.map(event => event.args.challengeId?.toString()) || []);

  const allChallengeIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const remainingFlags = allChallengeIds.filter(id => !userMintedChallengeIds.has(id));

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Flag Tracker 🚩</h2>
      <p className="text-sm text-base-content/70 mb-4">Track your progress in capturing all 12 flags.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Your Captured Flags</h3>
          <div className="space-y-2">
            {userFlags && userFlags.length > 0 ? (
              userFlags.map(event => (
                <div
                  key={event.args.tokenId?.toString()}
                  className="flex items-center space-x-2 bg-success/20 p-2 rounded"
                >
                  <span className="text-success">✓</span>
                  <span>
                    Flag #{event.args.challengeId?.toString()} (Token ID: {event.args.tokenId?.toString()})
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-base-content/70">No flags captured yet. Start solving challenges!</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Remaining Flags</h3>
          <div className="space-y-2">
            {remainingFlags.length > 0 ? (
              remainingFlags.map(challengeId => (
                <div key={challengeId} className="flex items-center space-x-2 bg-base-200 p-2 rounded">
                  <span>○</span>
                  <span>Flag #{challengeId}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-base-content/70">Congratulations! You've captured all flags! 🎉</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import { useAccount } from "wagmi";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth/notification";

export const FlagMintedNotifier = ({ children }: { children: React.ReactNode }) => {
  const { address: connectedAddress } = useAccount();

  useScaffoldWatchContractEvent({
    contractName: "NFTFlags",
    eventName: "FlagMinted",
    onLogs: logs => {
      void logs.map(log => {
        const { minter, tokenId, challengeId } = log.args as { minter: string; tokenId: bigint; challengeId: bigint };
        if (minter && connectedAddress && minter.toLowerCase() === connectedAddress.toLowerCase()) {
          notification.success(
            <div>
              <p className="font-bold mb-0">Flag Captured! 🚩</p>
              <p className="mt-0">
                You have captured flag #{challengeId?.toString()} (Token ID: {tokenId?.toString()})
              </p>
            </div>,
          );
        }
      });
    },
  });

  return <>{children}</>;
};

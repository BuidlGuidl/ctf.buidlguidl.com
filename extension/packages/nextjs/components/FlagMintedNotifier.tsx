"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth/notification";

export const FlagMintedNotifier = ({ children }: { children: React.ReactNode }) => {
  const { address: connectedAddress } = useAccount();
  const [processedEvents, setProcessedEvents] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      return new Set(JSON.parse(localStorage.getItem("processedFlagEvents") || "[]"));
    }
    return new Set();
  });

  useScaffoldWatchContractEvent({
    contractName: "NFTFlags",
    eventName: "FlagMinted",
    onLogs: logs => {
      if (!connectedAddress) return;

      logs.forEach(log => {
        const { minter, tokenId, challengeId } = log.args as {
          minter: string;
          tokenId: bigint;
          challengeId: bigint;
        };

        const eventKey = `${minter}-${challengeId}-${tokenId}`;
        if (minter.toLowerCase() === connectedAddress.toLowerCase() && !processedEvents.has(eventKey)) {
          notification.success(
            <div>
              <p className="font-bold mb-0">Flag Captured! 🚩</p>
              <p className="mt-0">
                You have captured flag #{challengeId?.toString()} (Token ID: {tokenId?.toString()})
              </p>
            </div>,
          );
          setProcessedEvents(prev => {
            const updatedProcessedEvents = new Set([...prev, eventKey]);
            localStorage.setItem("processedFlagEvents", JSON.stringify([...updatedProcessedEvents]));
            return updatedProcessedEvents;
          });
        }
      });
    },
  });

  return children;
};

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { notification } from "~~/utils/scaffold-eth/notification";

type EventMetadata = {
  eventKey: string;
  blockNumber: string;
  blockHash: string;
  transactionHash: string;
};

type ChainStorage = {
  [chainId: string]: {
    events: EventMetadata[];
    lastBlockHash?: string; // Track last known block hash to detect chain resets
  };
};

export const FlagMintedNotifier = ({ children }: { children: React.ReactNode }) => {
  const { address: connectedAddress } = useAccount();
  const configuredChainId = scaffoldConfig.targetNetworks[0].id;

  const [processedEvents, setProcessedEvents] = useState<ChainStorage>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("processedFlagEvents") || "{}");
    }
    return {};
  });

  // Helper function to check if an event has been processed for the current chain
  const isEventProcessed = (eventKey: string, chainId: number, blockHash: string) => {
    const chainData = processedEvents[chainId.toString()];
    if (!chainData?.events) return false;

    // For local chains, if block hash doesn't match, clear events and return false
    if (chainId === 31337 && chainData.lastBlockHash && chainData.lastBlockHash !== blockHash) {
      setProcessedEvents(prev => {
        const updated = { ...prev };
        updated[chainId.toString()] = { events: [], lastBlockHash: blockHash };
        localStorage.setItem("processedFlagEvents", JSON.stringify(updated));
        return updated;
      });
      return false;
    }

    return chainData.events.some(event => event.eventKey === eventKey);
  };

  // Helper function to store a new event for the current chain
  const storeProcessedEvent = (eventKey: string, chainId: number, metadata: Omit<EventMetadata, "eventKey">) => {
    const chainIdStr = chainId.toString();
    setProcessedEvents(prev => {
      const newEvent: EventMetadata = {
        eventKey,
        ...metadata,
      };

      const chainData = prev[chainIdStr] || { events: [] };
      const updatedChainData = {
        events: [...chainData.events, newEvent],
        lastBlockHash: metadata.blockHash,
      };

      const updatedProcessedEvents = {
        ...prev,
        [chainIdStr]: updatedChainData,
      };

      localStorage.setItem("processedFlagEvents", JSON.stringify(updatedProcessedEvents));
      return updatedProcessedEvents;
    });
  };

  useScaffoldWatchContractEvent({
    contractName: "NFTFlags",
    eventName: "FlagMinted",
    enabled: !!connectedAddress,
    onLogs: logs => {
      if (!connectedAddress) return;

      logs.forEach(log => {
        const { minter, tokenId, challengeId } = log.args as {
          minter: string;
          tokenId: bigint;
          challengeId: bigint;
        };

        const eventKey = `${minter}-${challengeId}-${tokenId}`;

        if (
          minter.toLowerCase() === connectedAddress.toLowerCase() &&
          !isEventProcessed(eventKey, configuredChainId, log.blockHash)
        ) {
          notification.success(
            <div>
              <p className="font-bold mb-0">Flag Captured! 🚩</p>
              <p className="mt-0">
                You have captured flag #{challengeId?.toString()} (Token ID: {tokenId?.toString()})
              </p>
            </div>,
          );

          storeProcessedEvent(eventKey, configuredChainId, {
            blockNumber: log.blockNumber.toString(),
            blockHash: log.blockHash,
            transactionHash: log.transactionHash,
          });
        }
      });
    },
  });

  return children;
};

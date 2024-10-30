"use client";

import clsx from "clsx";
import { Address } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth/useDeployedContractInfo";
import { ContractName } from "~~/utils/scaffold-eth/contract";

export const ChallengeContractAddress = ({ challengeNumber }: { challengeNumber: number }) => {
  let contractName = `Challenge${challengeNumber}` as ContractName;

  // hardcoded for Challenge 10
  if (challengeNumber === 10) {
    contractName = "NFTFlags";
  }

  const { data: contractInfo } = useDeployedContractInfo(contractName);

  const borderStyles = "absolute border-green-400 h-3 w-3";

  return (
    <>
      {contractInfo?.address && (
        <>
          <h3 className="mt-12 mb-8 font-dotGothic tracking-wide text-2xl">Contract Address</h3>
          <div className="flex justify-between items-center">
            <div className="p-2 relative w-60 flex justify-center items-center font-dotGothic">
              <div className={clsx(borderStyles, "top-0 left-0 border-t border-l")}></div>
              <div className={clsx(borderStyles, "top-0 right-0 border-t border-r")}></div>
              <div className={clsx(borderStyles, "bottom-0 left-0 border-b border-l")}></div>
              <div className={clsx(borderStyles, "bottom-0 right-0 border-b border-r")}></div>
              <Address address={contractInfo.address} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

import { useQueryClient } from "@tanstack/react-query";
import { Chain, hardhat } from "viem/chains";
import { UseBalanceParameters, useBalance, useWatchBlockNumber } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

/**
 * Wrapper around wagmi's useBalance hook. Updates data on every block change.
 */
export const useWatchBalance = (useBalanceParameters: UseBalanceParameters) => {
  const queryClient = useQueryClient();
  const { queryKey, ...restUseBalanceReturn } = useBalance(useBalanceParameters);
  useWatchBlockNumber({
    onBlockNumber() {
      queryClient.invalidateQueries({ queryKey });
    },
    ...((scaffoldConfig.targetNetworks[0].id as number) !== (hardhat as Chain).id
      ? {
          pollingInterval: 20_000,
        }
      : {}),
    chainId: scaffoldConfig.targetNetworks[0].id,
    enabled: true,
  });

  return restUseBalanceReturn;
};

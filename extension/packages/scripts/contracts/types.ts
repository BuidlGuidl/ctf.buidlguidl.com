import { Abi, Address } from "viem";
import deployedContractsData from "./deployedContracts";
import externalContractsData from "./externalContracts";
import type { MergeDeepRecord } from "type-fest/source/merge-deep";

type AddExternalFlag<T> = {
  [ChainId in keyof T]: {
    [ContractName in keyof T[ChainId]]: T[ChainId][ContractName] & {
      external?: true;
    };
  };
};

const deepMergeContracts = <
  L extends Record<PropertyKey, any>,
  E extends Record<PropertyKey, any>,
>(
  local: L,
  external: E,
) => {
  const result: Record<PropertyKey, any> = {};
  const allKeys = Array.from(
    new Set([...Object.keys(external), ...Object.keys(local)]),
  );
  for (const key of allKeys) {
    if (!external[key]) {
      result[key] = local[key];
      continue;
    }
    const amendedExternal = Object.fromEntries(
      Object.entries(
        external[key] as Record<string, Record<string, unknown>>,
      ).map(([contractName, declaration]) => [
        contractName,
        { ...declaration, external: true },
      ]),
    );
    result[key] = { ...local[key], ...amendedExternal };
  }
  return result as MergeDeepRecord<
    AddExternalFlag<L>,
    AddExternalFlag<E>,
    { arrayMergeMode: "replace" }
  >;
};

export type InheritedFunctions = { readonly [key: string]: string };

export type GenericContract = {
  address: Address;
  abi: Abi;
  inheritedFunctions?: InheritedFunctions;
  external?: true;
};

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: GenericContract;
  };
};

export const contractsData = deepMergeContracts(
  deployedContractsData,
  externalContractsData,
);

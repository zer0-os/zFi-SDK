import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { SubConfig } from "../types";

export const pendingYieldRewards = async (
  address: string,
  config: SubConfig
): Promise<ethers.BigNumber> => {
  if(!address || address.length !==  42)
    throw Error("Must provide a valid address")
  const corePool = await getCorePool(config);
  const pendingYieldRewards = await corePool.pendingYieldRewards(address);
  return pendingYieldRewards;
};

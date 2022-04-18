import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { PoolConfig } from "../types";

export const pendingYieldRewards = async (
  address: string,
  config: PoolConfig
): Promise<ethers.BigNumber> => {
  if (!ethers.utils.isAddress(address))
    throw Error("Must provide a valid user address");
  const corePool = await getCorePool(config);
  const pendingYieldRewards = await corePool.pendingYieldRewards(address);
  return pendingYieldRewards;
};

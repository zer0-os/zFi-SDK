import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { Config } from "../types";

export const pendingYieldRewards = async (
  address: string,
  config: Config
): Promise<ethers.BigNumber> => {
  const corePool = await getCorePool(config);
  const pendingYieldRewards = await corePool.pendingYieldRewards(address);
  return pendingYieldRewards;
};

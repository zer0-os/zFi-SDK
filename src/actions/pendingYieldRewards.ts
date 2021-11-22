import { ethers } from "ethers";
import { getLiquidityPool } from "../helpers";
import { Config } from "../types";

export const pendingYieldRewards = async (
  address: string,
  config: Config
): Promise<ethers.BigNumber> => {
  const liquidityPool = await getLiquidityPool(config);
  const pendingYieldRewards = await liquidityPool.pendingYieldRewards(address);
  return pendingYieldRewards;
};

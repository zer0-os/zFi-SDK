import { ethers } from "ethers";
import { ZStakeCorePool } from "../contracts/types";

export const pendingYieldRewards = async (
  address: string,
  corePool: ZStakeCorePool
): Promise<ethers.BigNumber> => {
  const pendingYieldRewards = await corePool.pendingYieldRewards(address);
  return pendingYieldRewards;
};

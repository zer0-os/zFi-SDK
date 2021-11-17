import { ethers } from "ethers";
import { ZStakePoolBase } from "../contracts/types";

export const pendingYieldRewards = async (
  address: string,
  poolBase: ZStakePoolBase
): Promise<ethers.BigNumber> => {
  const pendingYieldRewards = await poolBase.pendingYieldRewards(address);
  return pendingYieldRewards;
};

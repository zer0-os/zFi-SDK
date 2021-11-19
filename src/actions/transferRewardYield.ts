import { ethers } from "ethers";
import { ZStakeCorePool } from "../contracts/types";
import { getCorePool, getPoolFactory } from "../helpers";
import { Config } from "../types";
import { pendingYieldRewards } from ".";

export const transferRewardYield = async (
  poolAddress: string,
  toAddress: string,
  amount: string,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const factory = await getPoolFactory(config);
  const corePool = await getCorePool(config);

  const exists = await factory.poolExists(poolAddress);
  if (!exists) throw Error("Access denied");

  const pendingRewards = await pendingYieldRewards(toAddress, corePool);
  if (pendingRewards === ethers.BigNumber.from("0"))
    throw Error("No rewards to transfer");

  const tx = await factory
    .connect(poolAddress)
    .transferRewardYield(toAddress, amount);
  return tx;
};

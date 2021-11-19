import { ZStakeCorePool } from "../contracts/types";
import { getZStakeCorePool } from "../contracts";
import { Config } from "../types";

const REWARDS_CONSTANT = 10;
const PERCENT_CONSTANT = 100;

export const getCorePool = async (config: Config) => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.liquidityPoolAddress,
    config.provider
  );
  return corePool;
}

export const calculateRewards = (stakingAmount: number, lockPeriodDays: number) => {
  const rewards = stakingAmount *
          (REWARDS_CONSTANT / PERCENT_CONSTANT) *
          (1 + lockPeriodDays / 365);
  return rewards
}

export const calculateApr = (stakingAmount: number, lockPeriodDays: number) => {
  const rewards = calculateRewards(stakingAmount, lockPeriodDays);
  const apr = (rewards / stakingAmount) * PERCENT_CONSTANT;
  return apr;
}
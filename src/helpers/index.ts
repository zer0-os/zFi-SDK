import { ZStakeCorePool, ZStakePoolFactory } from "../contracts/types";
import { getZStakeCorePool, getZStakePoolFactory } from "../contracts";
import { Config } from "../types";

const REWARDS_CONSTANT = 10;
const PERCENT_CONSTANT = 100;

export const getCorePool = async (config: Config): Promise<ZStakeCorePool> => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.liquidityPoolAddress,
    config.provider
  );
  return corePool;
};

export const getPoolFactory = async (
  config: Config
): Promise<ZStakePoolFactory> => {
  const poolFactory: ZStakePoolFactory = await getZStakePoolFactory(
    config.tokenPoolAddress,
    config.provider
  );
  return poolFactory;
};

export const calculateRewards = (
  stakingAmount: number,
  lockPeriodDays: number,
  asApr: boolean
): number => {
  let rewards =
    stakingAmount *
    (REWARDS_CONSTANT / PERCENT_CONSTANT) *
    (1 + lockPeriodDays / 365);

  rewards = asApr ? (rewards / stakingAmount) * PERCENT_CONSTANT : rewards;
  return rewards;
};

import { ZStakeCorePool, ZStakePoolFactory } from "../contracts/types";
import { getZStakeCorePool, getZStakePoolFactory } from "../contracts";
import { Config } from "../types";

const REWARDS_CONSTANT = 10;
const PERCENT_CONSTANT = 100;

export const getLiquidityPool = async (config: Config): Promise<ZStakeCorePool> => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.liquidityPoolAddress,
    config.provider
  );
  return corePool;
};

export const getTokenPool = async (config: Config): Promise<ZStakeCorePool> => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.tokenPoolAddress,
    config.provider
  );
  return corePool;
};

export const getPoolFactory = async (
  config: Config
): Promise<ZStakePoolFactory> => {
  const poolFactory: ZStakePoolFactory = await getZStakePoolFactory(
    config.factoryAddress,
    config.provider
  );
  return poolFactory;
};

export const calculateRewards = (
  stakingAmount: number,
  lockPeriodDays: number,
  asPercentOfStake: boolean
): number => {
  let rewards =
    stakingAmount *
    (REWARDS_CONSTANT / PERCENT_CONSTANT) *
    (1 + lockPeriodDays / 365);

  if (asPercentOfStake) {
    return rewards / stakingAmount
  }
  return rewards;
};

import { ZStakeCorePool, ZStakePoolFactory } from "../contracts/types";
import { getZStakeCorePool, getZStakePoolFactory } from "../contracts";
import { FactoryConfig, PoolConfig } from "../types";

export const getCorePool = async (
  config: PoolConfig
): Promise<ZStakeCorePool> => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.address,
    config.provider
  );
  return corePool;
};

export const getPoolFactory = async (
  config: FactoryConfig
): Promise<ZStakePoolFactory> => {
  const poolFactory: ZStakePoolFactory = await getZStakePoolFactory(
    config.address,
    config.provider
  );
  return poolFactory;
};

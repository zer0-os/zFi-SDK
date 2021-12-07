import { ZStakeCorePool, ZStakePoolFactory } from "../contracts/types";
import { getZStakeCorePool, getZStakePoolFactory } from "../contracts";
import { SubConfig } from "../types";

export const getCorePool = async (
  config: SubConfig
): Promise<ZStakeCorePool> => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.address,
    config.provider
  );
  return corePool;
};

export const getPoolFactory = async (
  config: SubConfig
): Promise<ZStakePoolFactory> => {
  const poolFactory: ZStakePoolFactory = await getZStakePoolFactory(
    config.address,
    config.provider
  );
  return poolFactory;
};

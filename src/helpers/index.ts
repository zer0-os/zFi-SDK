import { ZStakeCorePool, ZStakePoolFactory } from "../contracts/types";
import { getZStakeCorePool, getZStakePoolFactory } from "../contracts";
import { Config } from "../types";

export const getCorePool = async (
  config: Config
) => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.poolAddress,
    config.provider
  );
  return corePool;
}

export const getPoolFactory = async (
  config: Config
): Promise<ZStakePoolFactory> => {
  const poolFactory: ZStakePoolFactory = await getZStakePoolFactory(
    config.factoryAddress,
    config.provider
  );
  return poolFactory;
};

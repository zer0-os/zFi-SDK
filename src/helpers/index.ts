import { ZStakeCorePool } from "../contracts/types";
import { getZStakeCorePool } from "../contracts";
import { Config } from "../types";

export const getCorePool = async (config: Config) => {
  const corePool: ZStakeCorePool = await getZStakeCorePool(
    config.liquidityPoolAddress,
    config.web3Provider
  );
  return corePool;
}
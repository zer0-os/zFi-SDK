import * as ethers from "ethers";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { SubConfig } from "../types";

export const calculatePoolApr = async (config: SubConfig): Promise<Number> => {
  const pool: ZStakeCorePool = await getCorePool(config);

  // Get the pool's factory as well
  const factoryAddress = await pool.factory();
  const provider = await pool.provider;
  const factory = await getPoolFactory({ address: factoryAddress, provider: provider });

  const poolData = await factory.getPoolData(pool.address);
  const poolWeight = poolData[2];
  const totalWeight = await factory.totalWeight();

  const weightRatio = poolWeight / totalWeight;

  const totalRewardsPerBlock = await factory.getRewardTokensPerBlock();
  const blocksPerYear = 2379070

  const rewardsInNextYear = Number(ethers.utils.formatEther(totalRewardsPerBlock)) * blocksPerYear

  const balance = await pool.poolTokenReserve();
  const apy = (rewardsInNextYear / Number(ethers.utils.formatUnits(balance, 18))) * weightRatio;

  return Number(ethers.utils.formatUnits(apy.toString(), 18));
}

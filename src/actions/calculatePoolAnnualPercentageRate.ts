import * as ethers from "ethers";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { NetworkChainId, PoolConfig } from "../types";
import {
  ethPriceUsd,
  getLpToken,
  getWethToken,
  getWildToken,
  networkAddresses,
  wildPriceUsd,
} from "./helpers";

export const calculatePoolAnnualPercentageRate = async (
  isLpTokenPool: boolean,
  config: PoolConfig
): Promise<number> => {
  let addresses;
  const network = await config.provider.getNetwork();
  const chainId: NetworkChainId = network.chainId
  addresses = networkAddresses[chainId]

  if (!addresses)
    throw Error(
      "No addresses could be inferred from the network. Use mainnet, rinkeby, or kovan"
    );

  const pool: ZStakeCorePool = await getCorePool(config);

  // Get the pool's factory as well
  const factoryAddress = addresses.factory;
  const provider = await pool.provider;
  const factory = await getPoolFactory({
    address: factoryAddress,
    provider: provider,
  });

  const promises = [
    pool.poolToken(),
    factory.totalWeight(),
    factory.getRewardTokensPerBlock(),
  ] as const;

  const [poolToken, totalWeight, totalRewardsPerBlock] = await Promise.all(
    promises
  );

  const poolData = await factory.getPoolData(poolToken);

  const poolWeight = poolData[2];
  const weightRatio = poolWeight / totalWeight;
  const blocksPerYear = 2379070;

  const rewardsInNextYear =
    Number(ethers.utils.formatUnits(totalRewardsPerBlock, 18)) * blocksPerYear;

  // If token pool, we have what we need APR
  if (!isLpTokenPool) {
    const balance = await pool.poolTokenReserve();
    const apr =
      (rewardsInNextYear / Number(ethers.utils.formatUnits(balance, 18))) *
      weightRatio;
    return apr * 100; // as percentage
  }

  const tokenPromises = [
    getWildToken(config.provider),
    getWethToken(config.provider),
    getLpToken(config.provider),
    wildPriceUsd(),
    ethPriceUsd(),
  ] as const;

  const [wildToken, wethToken, lpToken, wildPrice, ethPrice] =
  await Promise.all(tokenPromises);

  const balancePromises = [
    wildToken.balanceOf(addresses.UniswapPoolToken) as ethers.BigNumber,
    wethToken.balanceOf(addresses.UniswapPoolToken) as ethers.BigNumber,
    lpToken.totalSupply() as ethers.BigNumber,
  ] as const;

  const [wildBalance, wethBalance, lpTokenPoolBalance] = await Promise.all(
    balancePromises
  );

  const lpTokenTotalSupply = await (lpToken as ethers.Contract).totalSupply();

  const lpWildTvl =
    wildPrice * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl =
    ethPrice * Number(ethers.utils.formatEther(wethBalance));

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice =
    lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  const lpTokenPoolTvl =
    lpTokenPrice * Number(ethers.utils.formatEther(lpTokenPoolBalance));

  const lpTokenPoolApr =
    ((rewardsInNextYear * Number(wildPrice)) / lpTokenPoolTvl) * weightRatio;
  return lpTokenPoolApr * 100; // as percentage
};

import * as ethers from "ethers";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { SubConfig } from "../types";
import {
  ethPriceUsd,
  getLpToken,
  getWethToken,
  getWildToken,
  networkAddresses,
  wildPriceUsd
} from "./helpers";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];

export const calculatePoolApr = async (
  network: string,
  isLpTokenPool: boolean,
  config: SubConfig
): Promise<number> => {
  let addresses;
  switch (network) {
    case "mainnet":
      addresses = networkAddresses.mainnet;
      break;
    case "kovan":
      addresses = networkAddresses.kovan;
    default:
      break;
  }

  if (!addresses)
    throw Error(
      "No addresses could be inferred from the network. Use mainnet or kovan"
    );

  const pool: ZStakeCorePool = await getCorePool(config);

  // Get the pool's factory as well
  const factoryAddress = addresses.factory;
  const provider = await pool.provider;
  const factory = await getPoolFactory({
    address: factoryAddress,
    provider: provider,
  });

  const poolToken = await pool.poolToken();

  const poolData = await factory.getPoolData(poolToken);
  const poolWeight = poolData[2];
  const totalWeight = await factory.totalWeight();

  const weightRatio = poolWeight / totalWeight;

  const totalRewardsPerBlock = await factory.getRewardTokensPerBlock();
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

  const wildToken = await getWildToken(network, config.provider);
  const wEthToken = await getWethToken(network, config.provider);
  const lpToken = await getLpToken(network, config.provider);

  const wildPrice = await wildPriceUsd();
  const ethPrice = await ethPriceUsd();

  const wildBalance = await wildToken.balanceOf(addresses.UniswapPool);
  const wEthBalance = await wEthToken.balanceOf(addresses.UniswapPool);
  const lpTokenPoolBalance = await lpToken.balanceOf(
    addresses.lpTokenStakingPool
  );
  const lpTokenTotalSupply = await lpToken.totalSupply();

  const lpWildTvl =
    wildPrice * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = ethPrice * Number(ethers.utils.formatEther(wEthBalance));

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice =
    lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  const lpTokenPoolTvl =
    lpTokenPrice * Number(ethers.utils.formatEther(lpTokenPoolBalance));

  const lpTokenPoolApr =
    ((rewardsInNextYear * wildPrice) / lpTokenPoolTvl) * weightRatio;
  return lpTokenPoolApr * 100; // as percentage
};

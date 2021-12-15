import * as ethers from "ethers";
import CoinGecko from "coingecko-api";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { SubConfig } from "../types";

enum Addresses {
  KOVAN_WILD = "0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F",
  KOVAN_wETH = "0xf3a6679b266899042276804930b3bfbaf807f15b",
  MAINNET_WILD = "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34",
  MAINNET_wETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  UNISWAP_PAIR = "0xcaa004418eb42cdf00cb057b7c9e28f0ffd840a5",
}

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)"
];

export const calculatePoolApr = async (isLpTokenPool: boolean, config: SubConfig): Promise<any> => {
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

  const rewardsInNextYear = Number(ethers.utils.formatUnits(totalRewardsPerBlock, 18)) * blocksPerYear

  const balance = await pool.poolTokenReserve();

  // If token pool, we have what we need APR
  if (!isLpTokenPool) {
    const apr = (rewardsInNextYear / Number(ethers.utils.formatUnits(balance, 18))) * weightRatio;
    return Number(ethers.utils.formatUnits(apr.toString(), 18));
  }

  const client = new CoinGecko();
  const wildData = await client.coins.fetch("wilder-world", { market_data: true });
  const ethData = await client.coins.fetch("ethereum", { market_data: true });

  const wildPriceUsd = wildData.data.market_data.current_price.usd;
  const ethPriceUsd = ethData.data.market_data.current_price.usd;

  const wildToken = new ethers.Contract(Addresses.MAINNET_WILD, erc20Abi, config.provider);
  const wEthToken = new ethers.Contract(Addresses.MAINNET_wETH, erc20Abi, config.provider);
  const lpToken = new ethers.Contract(Addresses.UNISWAP_PAIR, erc20Abi, config.provider);

  const wildBalance = await wildToken.balanceOf(Addresses.UNISWAP_PAIR);
  const wEthBalance = await wEthToken.balanceOf(Addresses.UNISWAP_PAIR);
  const lpTokenPoolBalance = await lpToken.balanceOf(config.address);
  const lpTokenTotalSupply = await lpToken.totalSupply();

  console.log(wildBalance, wEthBalance);

  const lpWildTvl = wildPriceUsd * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = ethPriceUsd * Number(ethers.utils.formatEther(wEthBalance));

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice = lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  const lpTokenPoolTvl = lpTokenPrice * Number(ethers.utils.formatEther(lpTokenPoolBalance))

  const lpTokenPoolApr = ((rewardsInNextYear * wildPriceUsd) / lpTokenPoolTvl) * weightRatio;
  return lpTokenPoolApr;
}

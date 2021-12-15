import * as ethers from "ethers"
import CoinGecko from "coingecko-api";
import { SubConfig } from "../types";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";

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

export const calculatePoolTotalValueLocked = async (isLpTokenPool: boolean, config: SubConfig) => {
  const pool: ZStakeCorePool = await getCorePool(config);

  const balance = await pool.poolTokenReserve();

  const client = new CoinGecko();
  const wildData = await client.coins.fetch("wilder-world", { market_data: true });
  const ethData = await client.coins.fetch("ethereum", { market_data: true });

  const wildPriceUsd = wildData.data.market_data.current_price.usd;
  
  // If token pool, we have what we need to show APR
  if (!isLpTokenPool) {
    const tvl = balance.mul(wildPriceUsd);
    return Number(ethers.utils.formatUnits(tvl.toString(), 18));
  }
  
  const ethPriceUsd = ethData.data.market_data.current_price.usd;
  
  const wildToken = new ethers.Contract(Addresses.MAINNET_WILD, erc20Abi, config.provider);
  const wEthToken = new ethers.Contract(Addresses.MAINNET_wETH, erc20Abi, config.provider);

  const wildBalance = await wildToken.balanceOf(Addresses.UNISWAP_PAIR);
  const wEthBalance = await wEthToken.balanceOf(Addresses.UNISWAP_PAIR);

  console.log(wildBalance, wEthBalance);

  const lpWildTvl = wildPriceUsd * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = ethPriceUsd * Number(ethers.utils.formatEther(wEthBalance));

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;
  return lpTvl;
}
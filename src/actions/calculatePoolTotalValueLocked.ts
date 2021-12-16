import * as ethers from "ethers"
import CoinGecko from "coingecko-api";
import { SubConfig } from "../types";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { networkAddresses } from "./helpers";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)"
];

export const calculatePoolTotalValueLocked = async (network: string, isLpTokenPool: boolean, config: SubConfig) => {
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
    throw Error("No addresses could be inferred from the network. Use mainnet or kovan")

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
  
  const wildToken = new ethers.Contract(addresses.WILD, erc20Abi, config.provider);
  const wEthToken = new ethers.Contract(addresses.wETH, erc20Abi, config.provider);

  const wildBalance = await wildToken.balanceOf(addresses.lpTokenStakingPool);
  const wEthBalance = await wEthToken.balanceOf(addresses.lpTokenStakingPool);

  console.log(wildBalance, wEthBalance);

  const lpWildTvl = wildPriceUsd * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = ethPriceUsd * Number(ethers.utils.formatEther(wEthBalance));

  const tvl = lpWildTvl + lpWEthTvl;
  return tvl;
}
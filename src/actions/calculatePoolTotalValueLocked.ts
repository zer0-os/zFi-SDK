import * as ethers from "ethers";
import CoinGecko from "coingecko-api";
import { SubConfig, TotalValueLocked } from "../types";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { networkAddresses } from "./helpers";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];

export const calculatePoolTotalValueLocked = async (
  network: string,
  isLpTokenPool: boolean,
  config: SubConfig
): Promise<TotalValueLocked> => {
  console.log("test");
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

  const balance = await pool.poolTokenReserve();

  const client = new CoinGecko();
  const wildData = await client.coins.fetch("wilder-world", {
    market_data: true,
  });
  const ethData = await client.coins.fetch("ethereum", { market_data: true });

  const wildPriceUsd = wildData.data.market_data.current_price.usd;

  // If token pool, we have what we need to show APR
  if (!isLpTokenPool) {
    const tvl = Number(ethers.utils.formatEther(balance)) * wildPriceUsd;

    return {
      numberOfTokens: Number(ethers.utils.formatEther(balance)),
      valueOfTokensUSD: tvl,
    } as TotalValueLocked;
  }

  const ethPriceUsd = ethData.data.market_data.current_price.usd;

  const wildToken = new ethers.Contract(
    addresses.WILD,
    erc20Abi,
    config.provider
  );
  const wEthToken = new ethers.Contract(
    addresses.wETH,
    erc20Abi,
    config.provider
  );
  const lpToken = new ethers.Contract(
    addresses.UniswapPool,
    erc20Abi,
    config.provider
  );

  const wildBalance = await wildToken.balanceOf(addresses.UniswapPool);
  const wEthBalance = await wEthToken.balanceOf(addresses.UniswapPool);
  const lpTokenPoolBalance = await lpToken.balanceOf(
    addresses.lpTokenStakingPool
  );
  const lpTokenTotalSupply = await lpToken.totalSupply();

  const lpWildTvl =
    wildPriceUsd * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = ethPriceUsd * Number(ethers.utils.formatEther(wEthBalance));

  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice =
    lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  const lpTokenPoolTvl =
    lpTokenPrice * Number(ethers.utils.formatEther(lpTokenPoolBalance));

  return {
    numberOfTokens: Number(ethers.utils.formatEther(lpTokenPoolBalance)),
    valueOfTokensUSD: lpTokenPoolTvl,
  } as TotalValueLocked;
};

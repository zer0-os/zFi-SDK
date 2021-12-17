import * as ethers from "ethers";
import CoinGecko from "coingecko-api";
import { ZStakeCorePool } from "../contracts";
import { getCorePool, getPoolFactory } from "../helpers";
import { SubConfig } from "../types";
import { networkAddresses } from "./helpers";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];

export const calculatePoolApr = async (
  network: string,
  isLpTokenPool: boolean,
  config: SubConfig
): Promise<any> => {
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
    return apr;
  }

  const client = new CoinGecko();
  const wildData = await client.coins.fetch("wilder-world", {
    market_data: true,
  });
  const ethData = await client.coins.fetch("ethereum", { market_data: true });

  const wildPriceUsd = wildData.data.market_data.current_price.usd;
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

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice =
    lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  const lpTokenPoolTvl =
    lpTokenPrice * Number(ethers.utils.formatEther(lpTokenPoolBalance));

  const lpTokenPoolApr =
    ((rewardsInNextYear * wildPriceUsd) / lpTokenPoolTvl) * weightRatio;
  return lpTokenPoolApr;
};

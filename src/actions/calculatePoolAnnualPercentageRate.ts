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
  wildPriceUsd,
} from "./helpers";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];

export const calculatePoolAnnualPercentageRate = async (
  isLpTokenPool: boolean,
  config: SubConfig
): Promise<number> => {
  let addresses;
  const network = await config.provider.getNetwork();
  switch (network.chainId) {
    case 1:
      addresses = networkAddresses.mainnet;
      break;
    case 42:
      addresses = networkAddresses.kovan;
    default:
      addresses = networkAddresses.kovan;
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

  const promises = [
    pool.poolToken(),
    factory.totalWeight(),
    factory.getRewardTokensPerBlock(),
  ];

  const [poolToken, totalWeight, totalRewardsPerBlock] = await Promise.all(
    promises
  );

  const poolData = await factory.getPoolData(String(poolToken));

  const poolWeight = poolData[2];
  const weightRatio = poolWeight / Number(totalWeight);
  const blocksPerYear = 2379070;

  const rewardsInNextYear =
    Number(
      ethers.utils.formatUnits(ethers.BigNumber.from(totalRewardsPerBlock), 18)
    ) * blocksPerYear;

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
  ];

  const [
    wildToken,
    wethToken,
    lpToken,
    wildPrice,
    ethPrice,
  ] = await Promise.all(tokenPromises);

  const balancePromises = [
    (wildToken as ethers.Contract).balanceOf(addresses.UniswapPool) as ethers.BigNumber,
    (wethToken as ethers.Contract).balanceOf(addresses.UniswapPool) as ethers.BigNumber,
    (lpToken as ethers.Contract).totalSupply() as ethers.BigNumber,
  ];

  const [wildBalance, wethBalance, lpTokenPoolBalance] = await Promise.all(
    balancePromises
  );

  const lpTokenTotalSupply = await (lpToken as ethers.Contract).totalSupply();

  const lpWildTvl = Number(wildPrice) * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = Number(ethPrice) * Number(ethers.utils.formatEther(wethBalance));

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

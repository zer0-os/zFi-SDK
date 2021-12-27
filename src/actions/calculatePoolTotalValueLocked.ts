import * as ethers from "ethers";
import { SubConfig, TotalValueLocked } from "../types";
import { ZStakeCorePool } from "../contracts";
import { getCorePool } from "../helpers";
import { getLpToken, lpTokenPriceUsd, networkAddresses, wildPriceUsd } from "./helpers";

export const calculatePoolTotalValueLocked = async (
  isLpTokenPool: boolean,
  config: SubConfig
): Promise<TotalValueLocked> => {
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

  const balance = await pool.poolTokenReserve();

  const wildPrice = await wildPriceUsd();

  // If token pool, we have what we need to show APR
  if (!isLpTokenPool) {
    const tvl = Number(ethers.utils.formatEther(balance)) * wildPrice;

    return {
      numberOfTokens: Number(ethers.utils.formatEther(balance)),
      valueOfTokensUSD: tvl,
    } as TotalValueLocked;
  }

  const lpToken = await getLpToken(config.provider);

  const lpTokenPoolBalance = await lpToken.balanceOf(
    addresses.lpTokenStakingPool
  );

  const lpTokenPrice = await lpTokenPriceUsd(config.provider);

  const lpTokenPoolTvl =
    lpTokenPrice * Number(ethers.utils.formatEther(lpTokenPoolBalance));

  return {
    numberOfTokens: Number(ethers.utils.formatEther(lpTokenPoolBalance)),
    valueOfTokensUSD: lpTokenPoolTvl,
  } as TotalValueLocked;
};

import * as ethers from "ethers";
import { NetworkChainId, PoolConfig, TotalValueLocked } from "../types";
import { ZStakeCorePool } from "../contracts";
import { getCorePool } from "../helpers";
import {
  getLpToken,
  lpTokenPriceUsd,
  networkAddresses,
  wildPriceUsd,
} from "./helpers";

export const calculatePoolTotalValueLocked = async (
  isLpTokenPool: boolean,
  config: PoolConfig
): Promise<TotalValueLocked> => {
  let addresses;
  const network = await config.provider.getNetwork();
  const chainId: NetworkChainId = network.chainId;
  addresses = networkAddresses[chainId];

  if (!addresses)
    throw Error(
      "No addresses could be inferred from the network. Use mainnet, rinkeby, or kovan"
    );

  const pool: ZStakeCorePool = await getCorePool(config);

  const promises = [pool.poolTokenReserve(), wildPriceUsd()] as const;

  const [balance, wildPrice] = await Promise.all(
    promises
  );

  // If wild pool, we have what we need to show APR
  if (!isLpTokenPool) {
    // `wildPriceUsd()` returns a number already, but `wildPrice` is
    // type `ethers.BigNumber | number`, so must be explicit for compiler
    const tvl = wildPrice * Number(ethers.utils.formatEther(balance));

    return {
      numberOfTokens: Number(ethers.utils.formatEther(balance)),
      valueOfTokensUSD: tvl,
    } as TotalValueLocked;
  }

  const lpToken = await getLpToken(config.provider);

  let lpTokenPoolPromises = [
    lpToken.balanceOf(addresses.lpTokenStakingPool),
    lpTokenPriceUsd(config.provider),
  ];

  const [lpTokenPoolBalance, lpTokenPrice] = await Promise.all(
    lpTokenPoolPromises
  );

  const lpTokenPoolTvl =
    Number(lpTokenPrice) * Number(ethers.utils.formatEther(lpTokenPoolBalance));

  return {
    numberOfTokens: Number(ethers.utils.formatEther(lpTokenPoolBalance)),
    valueOfTokensUSD: lpTokenPoolTvl,
  } as TotalValueLocked;
};

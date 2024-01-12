import * as ethers from "ethers";
import { NetworkChainId, PoolConfig, TotalValueLocked } from "../types";
import { ZStakeCorePool } from "../contracts";
import { getCorePool } from "../helpers";
import {
  getLpToken,
  networkAddresses,
} from "./helpers";

export const calculatePoolTotalValueLocked = async (
  isLpTokenPool: boolean,
  config: PoolConfig
): Promise<number> => {
  let addresses;
  const network = await config.provider.getNetwork();
  const chainId: NetworkChainId = network.chainId;
  addresses = networkAddresses[chainId];

  if (!addresses)
    throw Error(
      "No addresses could be inferred from the network. Use mainnet, rinkeby, or kovan"
    );

  const pool: ZStakeCorePool = await getCorePool(config);

  const promises = [pool.poolTokenReserve()] as const;

  const [balance] = await Promise.all(promises);

  // If wild pool, we have what we need to show APR
  if (!isLpTokenPool) {
    // `wildPriceUsd()` returns a number already, but `wildPrice` is
    // type `ethers.BigNumber | number`, so must be explicit for compiler

    // 2024/01/12 - Do not return the USD price of the tokens, Brett will convert on the front end.
    // Only return the number of tokens in the pool

    return Number(ethers.utils.formatEther(balance));
  }

  const lpToken = await getLpToken(config.provider);

  let lpTokenPoolPromises = [
    lpToken.balanceOf(addresses.lpTokenStakingPool),
  ];

  const [lpTokenPoolBalance] = await Promise.all(lpTokenPoolPromises);

  return Number(ethers.utils.formatEther(lpTokenPoolBalance))
};

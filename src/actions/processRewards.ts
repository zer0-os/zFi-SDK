import { ethers } from "ethers";
import { pendingYieldRewards } from ".";
import { getLiquidityPool } from "../helpers";
import { Config } from "../types";

export const processRewards = async (
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  // Check pending rewards first to avoid unnecessary gas spending
  const liquidityPool = await getLiquidityPool(config);
  const address = await signer.getAddress();

  const pendingRewards = await pendingYieldRewards(address, config);

  if (pendingRewards === ethers.BigNumber.from("0"))
    throw Error("No rewards to process yet");

  // Will send rewards to the locked token pool
  const tx = await liquidityPool.connect(signer).processRewards();
  return tx;
};

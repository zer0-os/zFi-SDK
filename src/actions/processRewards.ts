import { ethers } from "ethers";
import { pendingYieldRewards } from ".";
import { getCorePool } from "../helpers";
import { SubConfig } from "../types";

export const processRewards = async (
  signer: ethers.Signer,
  config: SubConfig
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);

  // Check pending rewards first to avoid unnecessary gas spending
  const address = await signer.getAddress();

  const pendingRewards = await pendingYieldRewards(address, config);

  if (pendingRewards === ethers.BigNumber.from("0"))
    throw Error("No rewards to process yet");

  // Will send rewards to the locked token pool
  const tx = await corePool.connect(signer).processRewards();
  return tx;
};

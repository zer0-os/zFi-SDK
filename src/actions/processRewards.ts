import { ethers } from "ethers";
import { pendingYieldRewards } from ".";
import { ZStakeCorePool, ZStakePoolBase } from "../contracts/types";

export const processRewards = async (
  signer: ethers.Signer,
  corePool: ZStakeCorePool
): Promise<ethers.ContractTransaction> => {
  // Check pending rewards first to avoid unnecessary gas spending
  const address = await signer.getAddress();
  const pendingRewards = await pendingYieldRewards(address, corePool);

  if (pendingRewards === ethers.BigNumber.from("0"))
    throw Error("No rewards to process yet");

  const tx = await corePool.connect(signer).processRewards();
  return tx;
};

import { ethers } from "ethers";
import { pendingYieldRewards } from ".";
import { ZStakePoolBase } from "../contracts/types";

export const processRewards = async (
  signer: ethers.Signer,
  poolBase: ZStakePoolBase
): Promise<ethers.ContractTransaction> => {
  // Check view function first to avoid unnecessary gas spending
  const address = await signer.getAddress();
  const pendingRewards = await pendingYieldRewards(address, poolBase);

   // throw error or return 0?
  if (pendingRewards === ethers.BigNumber.from("0")) throw Error("No rewards to process yet");

  const tx = await poolBase.connect(signer).processRewards();
  return tx;
};

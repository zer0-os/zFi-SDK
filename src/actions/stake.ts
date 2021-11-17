import { ethers } from "ethers";
import { ZStakeCorePool, ZStakePoolBase } from "../contracts/types";

export const stake = async (
  amount: string,
  lockUntil: string,
  signer: ethers.Signer,
  corePool: ZStakeCorePool
): Promise<ethers.ContractTransaction> => {
  const tx = await corePool.connect(signer).stake(amount, lockUntil);
  return tx;
};

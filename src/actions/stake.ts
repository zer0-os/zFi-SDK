import { ethers } from "ethers";
import { ZStakePoolBase } from "../contracts/types";

export const stake = async (
  amount: string,
  lockUntil: string,
  signer: ethers.Signer,
  poolBase: ZStakePoolBase
): Promise<ethers.ContractTransaction> => {
  const tx = await poolBase.connect(signer).stake(amount, lockUntil);
  return tx;
};

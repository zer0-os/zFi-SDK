import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { SubConfig } from "../types";

export const stake = async (
  amount: string,
  lockUntil: ethers.BigNumber,
  signer: ethers.Signer,
  config: SubConfig
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);
  const tx = await corePool.connect(signer).stake(amount, lockUntil);
  return tx;
};

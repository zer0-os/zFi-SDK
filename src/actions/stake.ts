import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { Config } from "../types";

export const stake = async (
  amount: string,
  lockUntil: ethers.BigNumber,
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);
  const stakeAmount = ethers.BigNumber.from(amount);
  const tx = await corePool.connect(signer).stake(stakeAmount, lockUntil);
  return tx;
};

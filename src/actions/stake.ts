import { ethers } from "ethers";
import { ZStakeCorePool, ZStakePoolBase } from "../contracts/types";
import { getCorePool } from "../helpers";
import { Config } from "../types";

export const stake = async (
  amount: string,
  lockUntil: string,
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);
  const tx = await corePool.connect(signer).stake(amount, lockUntil);
  return tx;
};

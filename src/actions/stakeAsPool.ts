import { ethers } from "ethers";
import { ZStakeCorePool, ZStakePoolBase } from "../contracts/types";
import { getCorePool } from "../helpers";
import { Config } from "../types";

export const stakeAsPool = async (
  stakerAddress: string,
  amount: string,
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);
  const tx = await corePool.connect(signer).stakeAsPool(stakerAddress, amount);
  return tx;
};

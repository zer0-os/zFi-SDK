import { ethers } from "ethers";
import { ZStakeCorePool, ZStakePoolBase } from "../contracts/types";

export const stakeAsPool = async (
  stakerAddress: string,
  amount: string,
  signer: ethers.Signer,
  corePool: ZStakeCorePool
): Promise<ethers.ContractTransaction> => {
  const tx = await corePool.connect(signer).stakeAsPool(stakerAddress, amount);
  return tx;
};

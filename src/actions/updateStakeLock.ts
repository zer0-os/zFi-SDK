import * as ethers from "ethers";
import { getCorePool } from "../helpers";
import { PoolConfig } from "../types";

export const updateStakeLock = async (
  depositId: string,
  lockUntil: ethers.BigNumber,
  signer: ethers.Signer,
  config: PoolConfig
): Promise<ethers.ContractTransaction> => {
  if (lockUntil.lte(ethers.BigNumber.from("0")))
    throw Error("Cannot add zero or negative time to your locking period");
  const corePool = await getCorePool(config);
  const tx = await corePool
    .connect(signer)
    .updateStakeLock(depositId, lockUntil);
  return tx;
};

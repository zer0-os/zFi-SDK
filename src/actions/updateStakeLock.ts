import * as ethers from "ethers";
import { getCorePool } from "../helpers";
import { SubConfig } from "../types";

export const updateStakeLock = async (
  depositId: string,
  lockUntil: ethers.BigNumber,
  signer: ethers.Signer,
  config: SubConfig
) => {
  const corePool = await getCorePool(config);
  const tx = await corePool
    .connect(signer)
    .updateStakeLock(depositId, lockUntil);
  return tx;
};

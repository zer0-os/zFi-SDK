import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { SubConfig } from "../types";

export const stake = async (
  amount: string,
  lockUntil: ethers.BigNumberish,
  signer: ethers.Signer,
  config: SubConfig
): Promise<ethers.ContractTransaction> => {
  if (ethers.BigNumber.from(amount).lte(ethers.BigNumber.from(0)))
    throw Error("Cannot call to stake with no value given");

  const corePool = await getCorePool(config);
  const stakeAmount = ethers.BigNumber.from(amount);
  const tx = await corePool.connect(signer).stake(stakeAmount, lockUntil);
  return tx;
};

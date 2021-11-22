import { ethers } from "ethers";
import { ZStakeCorePool, ZStakePoolBase } from "../contracts/types";
import { getLiquidityPool } from "../helpers";
import { Config } from "../types";

export const stake = async (
  amount: string,
  lockUntil: ethers.BigNumber,
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const liquidityPool = await getLiquidityPool(config);
  const tx = await liquidityPool.connect(signer).stake(amount, lockUntil);
  return tx;
};

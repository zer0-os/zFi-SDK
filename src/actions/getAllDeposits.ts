import { ethers } from "ethers";
import { getLiquidityPool } from "../helpers";
import { Config, Deposit } from "../types";

export const getAllDeposits = async (
  address: string,
  config: Config
): Promise<Deposit[]> => {
  const liquidityPool = await getLiquidityPool(config);

  const depositLength = await liquidityPool.getDepositsLength(address);

  const deposits: Deposit[] = [];

  for (let i = 0; i < depositLength.toNumber(); i++) {
    const deposit = await liquidityPool.getDeposit(
      address,
      ethers.BigNumber.from(i)
    );
    deposits.push(deposit);
  }
  return deposits;
};

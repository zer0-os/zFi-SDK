import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { Config, Deposit } from "../types";

export const getAllDeposits = async (
  address: string,
  config: Config
): Promise<Deposit[]> => {
  const corePool = await getCorePool(config);

  const depositLength = await corePool.getDepositsLength(address);

  const deposits: Deposit[] = [];

  for (let i = 0; i < depositLength.toNumber(); i++) {
    const deposit = await corePool.getDeposit(
      address,
      ethers.BigNumber.from(i)
    );
    deposits.push(deposit);
  }
  return deposits;
};

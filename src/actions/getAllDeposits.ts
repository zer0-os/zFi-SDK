import { ethers } from "ethers";
import { ZStakeCorePool } from "../contracts/types";
import { Deposit } from "../types";

export const getAllDeposits = async (
  address: string,
  corePool: ZStakeCorePool
): Promise<Deposit[]> => {
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

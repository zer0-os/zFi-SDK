import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { SubConfig, Deposit } from "../types";

export const getAllDeposits = async (
  address: string,
  config: SubConfig
): Promise<Deposit[]> => {
  if (!ethers.utils.isAddress(address))
    throw Error("Must provide a valid user address");

  const corePool = await getCorePool(config);
  const depositLength = await corePool.getDepositsLength(address);

  if (depositLength.eq(ethers.BigNumber.from("0"))) return [];

  const deposits: Deposit[] = [];

  for (let i = 0; i < depositLength.toNumber(); i++) {
    const deposit = await corePool.getDeposit(
      address,
      ethers.BigNumber.from(i)
    );
    // Deposits are left in array even after being unstaked
    // Must check for empty deposits and only add valid,
    // non-zero deposits
    if (!deposit.tokenAmount.eq(ethers.BigNumber.from("0")))
      deposits.push({ depositId: i, ...deposit });
  }
  return deposits;
};

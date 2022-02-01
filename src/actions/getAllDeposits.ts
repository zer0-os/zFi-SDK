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

  const promiseArray: Promise<any>[] = [];
  
  for (let i = 0; i < depositLength.toNumber(); i++) {
    const depositPromise = corePool.getDeposit(
      address,
      ethers.BigNumber.from(i)
    );
    promiseArray.push(depositPromise);
  }

  let deposits = (await Promise.all(promiseArray)).map<Deposit>(d => { return {...d} as Deposit });
  deposits = deposits.filter(deposit => !deposit.tokenAmount.eq(ethers.BigNumber.from("0")));
  return deposits;
};

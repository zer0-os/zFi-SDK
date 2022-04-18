import { ethers } from "ethers";
import { getCorePool } from "../helpers";
import { PoolConfig, LegacyDeposit } from "../types";

export const getAllDepositsLegacy = async (
  address: string,
  config: PoolConfig
): Promise<LegacyDeposit[]> => {
  if (!ethers.utils.isAddress(address)) {
    throw Error("Must provide a valid user address");
  }
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

  let deposits = (await Promise.all(promiseArray)).map<LegacyDeposit>((d, i) => {
    return { depositId: i, ...d } as LegacyDeposit;
  });
  // Filter to only include deposits that have a non-zero value
  deposits = deposits.filter(
    (deposit) => !deposit.tokenAmount.eq("0")
  );
  return deposits as LegacyDeposit[];
};

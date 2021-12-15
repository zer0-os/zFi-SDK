import { ethers } from "ethers";
import { getAllDeposits } from ".";
import { SubConfig, UserValue } from "../types";

export const calculateUserValueLocked = async (
  userAddress: string,
  config: SubConfig
): Promise<UserValue> => {
  if (!ethers.utils.isAddress(userAddress))
    throw Error("Must provide a valid user address");

  const allUserDeposits = await getAllDeposits(userAddress, config);

  // Date.now() returns in milliseconds, convert to seconds for comparison
  const timeNow = ethers.BigNumber.from(Math.round(Date.now() / 1000));

  let userValueLocked = ethers.BigNumber.from("0");
  let userValueUnlocked = ethers.BigNumber.from("0");
  for (const deposit of allUserDeposits) {
    if (timeNow.lt(deposit.lockedUntil)) {
      userValueLocked = userValueLocked.add(deposit.tokenAmount);
    } else {
      userValueUnlocked = userValueUnlocked.add(deposit.tokenAmount);
    }
  }

  return {
    userValueLocked: userValueLocked,
    userValueUnlocked: userValueUnlocked,
  } as UserValue;
};

import { ethers } from "ethers";
import { getAllDeposits } from ".";
import { SubConfig } from "../types";

export const calculateUserValueLocked = async (
  userAddress: string,
  config: SubConfig
) => {
  if (!userAddress || userAddress.length !== 42)
    throw Error("Must provide a valid user address");

  const allUserDeposits = await getAllDeposits(userAddress, config);

  // Date.now() returns in milliseconds, convert to seconds for comparison
  const timeNow = ethers.BigNumber.from(Date.now() * 1000);

  let userValueLocked = ethers.BigNumber.from("0");
  let userValueUnlocked = ethers.BigNumber.from("0");
  for (const deposit of allUserDeposits) {
    // if negative, still locked, if 0 or positive it is unlocked
    if (timeNow.sub(deposit.lockedUntil).lt(ethers.BigNumber.from("0"))) {
      userValueLocked = userValueLocked.add(deposit.tokenAmount);
    } else {
      userValueUnlocked = userValueUnlocked.add(deposit.tokenAmount);
    }
  }
  return {
    userValueLocked: userValueLocked,
    userValueUnlocked: userValueUnlocked,
  };
};

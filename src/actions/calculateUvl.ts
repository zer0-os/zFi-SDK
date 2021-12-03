import { ethers } from "ethers";
import { getAllDeposits } from ".";
import { SubConfig } from "../types";

export const calculateUserValueLocked = async (userAddress: string, config: SubConfig) => {
  const allUserDeposits = await getAllDeposits(userAddress, config);

  // Date.now() returns in milliseconds, convert to seconds for comparison
  const timeNow = ethers.BigNumber.from(Date.now() * 1000);

  const userValueLocked = ethers.BigNumber.from("0");
  const userValueUnlocked = ethers.BigNumber.from("0")
  for (const deposit of allUserDeposits) {
    // if negative, still locked, if 0 or positive it is unlocked
    if (timeNow.sub(deposit.lockedUntil).lt(ethers.BigNumber.from("0"))) {
      userValueLocked.add(deposit.tokenAmount);
    } else {
      userValueUnlocked.add(deposit.tokenAmount);
    }
  }
  return [userValueLocked, userValueUnlocked];
}
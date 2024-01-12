import { ethers } from "ethers";
import { getAllDepositsLegacy } from ".";
import { PoolConfig, UserValue } from "../types";
import { lpTokenPriceUsd, wildPriceUsd } from "./helpers";

export const calculateUserValueStaked = async (
  userAddress: string,
  isLpTokenPool: boolean,
  config: PoolConfig
): Promise<UserValue> => {
  if (!ethers.utils.isAddress(userAddress))
    throw Error("Must provide a valid user address");

  // 2024/01/12 - Do not return the USD price of the tokens, Brett will convert on the front end.
  // Only return the number of tokens in the pool

  const allUserDeposits = await getAllDepositsLegacy(userAddress, config);

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
  };
};

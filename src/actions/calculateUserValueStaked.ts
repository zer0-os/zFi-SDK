import { ethers } from "ethers";
import { getAllDeposits } from ".";
import { SubConfig, UserValue } from "../types";
import { lpTokenPriceUsd, wildPriceUsd } from "./helpers";

export const calculateUserValueStaked = async (
  userAddress: string,
  isLpTokenPool: boolean,
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

  let tokenPrice;

  if (isLpTokenPool) {
    tokenPrice = await lpTokenPriceUsd(config.provider)
  } else {
    tokenPrice = await wildPriceUsd();
  }

  const formattedValueLocked = ethers.utils.formatEther(userValueLocked);
  const formattedValueUnlocked = ethers.utils.formatEther(userValueUnlocked);

  const userValueLockedUsd = Number(formattedValueLocked) * tokenPrice;
  const userValueUnlockedUsd = Number(formattedValueUnlocked) * tokenPrice;

  return {
    userValueLocked: userValueLocked,
    userValueLockedUsd: userValueLockedUsd,
    userValueUnlocked: userValueUnlocked,
    userValueUnlockedUsd: userValueUnlockedUsd
  };
};

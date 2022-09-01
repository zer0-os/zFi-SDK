import { ethers } from "ethers";
import { PoolConfig, Deposit } from "../types";
import { getCorePool } from "../helpers";

export const unstake = async (
  depositId: string,
  amount: string,
  signer: ethers.Signer,
  config: PoolConfig
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);

  const address = await signer.getAddress();

  if (ethers.BigNumber.from(amount).lte(ethers.BigNumber.from(0)))
    throw Error("You can only unstake a non-zero amount of tokens");

  const depositsLength = await corePool.getDepositsLength(address);

  if (depositsLength.eq(ethers.BigNumber.from(0))) {
    throw Error("There are no deposits for you to unstake");
  }

  // Given depositId cannot be greater than the zero-based number of deposits
  if (ethers.BigNumber.from(depositId).gt(depositsLength)) {
    throw Error(
      "Given depositId must be less than the total number of deposits."
    );
  }

  const deposit = await corePool.getDeposit(address, depositId);
  if (ethers.BigNumber.from(amount).gt(deposit.tokenAmount)) {
    throw Error("You cannot unstake more than the original stake amount");
  }

  // Date.now() is ms, convert to s
  const dateConverted = Math.round(Date.now() / 1000);
  if (ethers.BigNumber.from(dateConverted).lt(deposit.lockedUntil)) {
    throw Error(
      "You are not able to unstake when your deposit is still locked"
    );
  }

  const tx = await corePool
    .connect(signer)
    .unstake(ethers.BigNumber.from(depositId), ethers.BigNumber.from(amount));
  return tx;
};

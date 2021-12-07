import { ethers } from "ethers";
import { SubConfig, Deposit } from "../types";
import { getCorePool } from "../helpers";

export const unstake = async (
  depositId: string,
  amount: string,
  signer: ethers.Signer,
  config: SubConfig
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);

  const address = await signer.getAddress();

  if (ethers.BigNumber.from(amount).lte(ethers.BigNumber.from(0)))
    throw Error("You can only unstake a non-zero amount of tokens");

  const depositsLength = await corePool.getDepositsLength(address);
  if (depositsLength.eq(ethers.BigNumber.from(0)))
    throw Error("There are no deposits for you to unstake");

  const deposit: Deposit = await corePool.getDeposit(address, depositId);
  if (ethers.BigNumber.from(amount).gt(deposit.tokenAmount))
    throw Error("You cannot unstake more than the original stake amount");

  if (ethers.BigNumber.from(Date.now()).lt(deposit.lockedUntil))
    throw Error(
      "You are not able to unstake when your deposit is still locked"
    );

  const tx = await corePool
    .connect(signer)
    .unstake(ethers.BigNumber.from(depositId), ethers.BigNumber.from(amount));
  return tx;
};

import { ethers } from "ethers";
import { Config, Deposit } from "../types";
import { getCorePool } from "../helpers";

export const unstake = async (
  depositId: string,
  amount: string,
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const corePool = await getCorePool(config);

  const address = await signer.getAddress();
  const depositsLength = await corePool.getDepositsLength(address);

  if (ethers.BigNumber.from(amount) <= ethers.BigNumber.from(0))
    throw Error("You can only unstake a non-zero amount of tokens");

  if (depositsLength === ethers.BigNumber.from("0"))
    throw Error("There are no deposits for you to unstake");

  const deposit: Deposit = await corePool.getDeposit(address, depositId);
  if (ethers.BigNumber.from(amount) > deposit.tokenAmount)
    throw Error("You cannot unstake more than the original stake amount");

  if (ethers.BigNumber.from(Date.now()) < deposit.lockedUntil)
    throw Error(
      "You are not able to unstake when your deposit is still locked"
    );

  const tx = await corePool
    .connect(signer)
    .unstake(ethers.BigNumber.from(depositId), ethers.BigNumber.from(amount));
  return tx;
};

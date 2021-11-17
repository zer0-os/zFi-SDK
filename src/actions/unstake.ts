import { ethers } from "ethers";
import { Deposit } from "../types";
import { ZStakePoolBase } from "../contracts/types";

export const unstake = async (
  depositId: string,
  amount: string,
  signer: ethers.Signer,
  poolBase: ZStakePoolBase
): Promise<ethers.ContractTransaction> => {
  const address = await signer.getAddress();
  const depositsLength = await poolBase.getDepositsLength(address);

  if (ethers.BigNumber.from(amount) <= ethers.BigNumber.from(0))
    throw Error("User cannot unstake nothing");

  if (depositsLength === ethers.BigNumber.from("0"))
    throw Error("User cannot unstake with no active stake");

  const deposit: Deposit = await poolBase.getDeposit(address, depositId);
  if (ethers.BigNumber.from(amount) > deposit.tokenAmount)
    throw Error("User cannot unstake more than they have in the staking pool");

  if (ethers.BigNumber.from(Date.now()) < deposit.lockedUntil)
    throw Error("User cannot unstake a deposit that is still locked.");

  const tx = await poolBase.connect(signer).unstake(depositId, amount);
  return tx;
};

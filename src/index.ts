import * as ethers from "ethers";
import { Config, Deposit, Instance } from "./types";
import { ZStakePoolBase } from "./contracts/types";
import { getZStakePoolBase } from "./contracts";
import * as actions from "./actions";

export const createInstance = (config: Config): Instance => {
  const instance: Instance = {
    // Stake your liquidity tokens for providing the WILD/ETH pair
    stake: async (
      amount: string,
      lockUntil: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const poolBase: ZStakePoolBase = await getZStakePoolBase(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      const tx = await actions.stake(amount, lockUntil, signer, poolBase);
      return tx;
    },
    unstake: async (
      depositId: string,
      amount: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const poolBase: ZStakePoolBase = await getZStakePoolBase(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      const tx = await actions.unstake(depositId, amount, signer, poolBase);
      return tx;
    },
    // processRewards
    // updateStakeLock
    // pendingYieldRewards
    // getDeposit ? user[_user].deposits[_depositId]
    // getDepositLength? doesn't help us avoid gas if we just require a second tx
    // balanceOf ?
  };
  return instance;
};

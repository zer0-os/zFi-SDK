import * as ethers from "ethers";
import { Config, Deposit, Instance, User, UserObject } from "./types";
import { ZStakeCorePool } from "./contracts/types";
import { getZStakeCorePool } from "./contracts";
import * as actions from "./actions";

export const createInstance = (config: Config): Instance => {
  const instance: Instance = {
    // Stake your liquidity tokens for providing the WILD/ETH pair
    stake: async (
      amount: string,
      lockUntil: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );

      const tx = await actions.stake(amount, lockUntil, signer, corePool);
      return tx;
    },
    unstake: async (
      depositId: string,
      amount: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      const tx = await actions.unstake(depositId, amount, signer, corePool);
      return tx;
    },
    processRewards: async (
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      const tx = await actions.processRewards(signer, corePool);
      return tx;
    },
    updateStakeLock: async (
      depositId: string,
      lockedUntil: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );

      const tx = await corePool
        .connect(signer)
        .updateStakeLock(depositId, lockedUntil);
      return tx;
    },
    // View Functions
    pendingYieldRewards: async (address: string): Promise<ethers.BigNumber> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      // If address has no associated stake it will just return 0
      const pendingRewards = await actions.pendingYieldRewards(
        address,
        corePool
      );
      return pendingRewards;
    },
    getUser: async (address: string): Promise<any> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      // Typing? No 'deposits' property as a struct?
      const user = await corePool.users(address);
      return user;
    },
    getDeposit: async (
      depositId: string,
      address: string
    ): Promise<Deposit> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      const deposit: Deposit = await corePool.getDeposit(address, depositId);
      return deposit;
    },
    getDepositsLength: async (address: string): Promise<ethers.BigNumber> => {
      const corePool: ZStakeCorePool = await getZStakeCorePool(
        config.liquidityPoolAddress,
        config.web3Provider
      );
      const depositsLength = corePool.getDepositsLength(address);
      return depositsLength;
    },
  };
  return instance;
};

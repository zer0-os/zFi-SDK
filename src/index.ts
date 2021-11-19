import * as ethers from "ethers";
import * as actions from "./actions";
import { getCorePool, calculateRewards, calculateApr } from "./helpers";
import { Config, Deposit, Instance, User } from "./types";

export const createInstance = (config: Config): Instance => {
  const instance: Instance = {
    // Stake your liquidity tokens for providing the WILD/ETH pair
    stake: async (
      amount: string,
      lockUntil: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool = await getCorePool(config);
      const tx = await actions.stake(amount, lockUntil, signer, corePool);
      return tx;
    },
    unstake: async (
      depositId: string,
      amount: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool = await getCorePool(config);
      const tx = await actions.unstake(depositId, amount, signer, corePool);
      return tx;
    },
    processRewards: async (
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool = await getCorePool(config);
      const tx = await actions.processRewards(signer, corePool);
      return tx;
    },
    updateStakeLock: async (
      depositId: string,
      lockedUntil: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool = await getCorePool(config);
      const tx = await corePool
        .connect(signer)
        .updateStakeLock(depositId, lockedUntil);
      return tx;
    },
    // View Functions
    pendingYieldRewards: async (address: string): Promise<ethers.BigNumber> => {
      const corePool = await getCorePool(config);
      // If address has no associated stake it returns 0
      const pendingRewards = await actions.pendingYieldRewards(
        address,
        corePool
      );
      return pendingRewards;
    },
    getDeposit: async (
      depositId: string,
      address: string
    ): Promise<Deposit> => {
      const corePool = await getCorePool(config);
      const deposit: Deposit = await corePool.getDeposit(address, depositId);
      return deposit;
    },
    getDepositsLength: async (address: string): Promise<ethers.BigNumber> => {
      const corePool = await getCorePool(config);
      const depositsLength = await corePool.getDepositsLength(address);
      return depositsLength;
    },
    getAllDeposits: async (address: string): Promise<Deposit[]> => {
      const corePool = await getCorePool(config);
      const deposits = await actions.getAllDeposits(address, corePool);
      return deposits;
    },
    // Variables
    getUser: async (address: string): Promise<User> => {
      const corePool = await getCorePool(config);
      const user: User = await corePool.users(address);
      return user;
    },
    getPoolToken: async (): Promise<string> => {
      const corePool = await getCorePool(config);
      const poolToken = await corePool.poolToken();
      return poolToken;
    },
    getLastYieldDistribution: async (): Promise<ethers.BigNumber> => {
      const corePool = await getCorePool(config);
      const lastYieldDistribution = await corePool.lastYieldDistribution();
      return lastYieldDistribution;
    },
    getWeight: async (): Promise<number> => {
      const corePool = await getCorePool(config);
      const weight = await corePool.weight();
      return weight;
    },
    // Utility Functions
    calculateRewards: (
      stakingAmount: number,
      lockPeriodDays: number
    ): number => {
      // Assumes fixed 10%
      if (lockPeriodDays > 0 && lockPeriodDays <= 365) {
        const rewards = calculateRewards(stakingAmount, lockPeriodDays);
        return rewards;
      }
      return 0;
    },
    calculateApr: (stakingAmount: number, lockPeriodDays: number): number => {
      if (lockPeriodDays > 0 && lockPeriodDays <= 365) {
        const apr = calculateApr(stakingAmount, lockPeriodDays);
        return apr;
      }
      return 0;
    },
  };

  return instance;
};

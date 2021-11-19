import * as ethers from "ethers";
import * as actions from "./actions";
import {
  getCorePool,
  calculateRewards,
  calculateApr,
  getPoolFactory,
} from "./helpers";
import { Config, Deposit, Instance, PoolData, User } from "./types";

export const createInstance = (config: Config): Instance => {
  const instance: Instance = {
    // Stake your liquidity tokens for providing the WILD/ETH pair
    // Core Pool
    stake: async (
      amount: string,
      lockUntil: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.stake(amount, lockUntil, signer, config);
      return tx;
    },

    unstake: async (
      depositId: string,
      amount: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.unstake(depositId, amount, signer, config);
      return tx;
    },
    processRewards: async (
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.processRewards(signer, config);
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
    // Pool Factory
    // Rewards from staked token ??
    stakeAsPool: async (
      stakerAddress: string,
      amount: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const corePool = await getCorePool(config);
      const tx = await actions.stakeAsPool(
        stakerAddress,
        amount,
        signer,
        corePool
      );
      return tx;
    },
    registerPool: async (
      poolAddress: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const factory = await getPoolFactory(config);
      const poolAddressCheck = await factory.pools(poolAddress);
      if (poolAddressCheck !== "0") throw Error("This pool is already registered");
      const tx = factory.connect(signer).registerPool(poolAddress);
      return tx;
    },
    transferRewardYield: async (poolAddress: string, toAddress: string, amount: string): Promise<ethers.ContractTransaction> => {
      const tx = await actions.transferRewardYield(poolAddress, toAddress, amount, config);
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
    getPoolAddress: async (poolToken: string): Promise<string> => {
      const factory = await getPoolFactory(config);
      const poolAddress = await factory.getPoolAddress(poolToken);
      return poolAddress;
    },
    getPoolData: async (poolAddress: string): Promise<PoolData> => {
      if (poolAddress === "0" || poolAddress === "0x0")
        throw Error("Cannot get pool data for empty pool address");
      const factory = await getPoolFactory(config);
      const poolData: PoolData = await factory.getPoolData(poolAddress);
      return poolData;
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

import * as ethers from "ethers";
import * as actions from "./actions";
import {
  getCorePool,
  calculateRewards,
  getPoolFactory,
} from "./helpers";
import { Config, Deposit, Instance, PoolData, User } from "./types";

export const createInstance = (config: Config): Instance => {
  const instance: Instance = {
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
    stakeAsPool: async (
      stakerAddress: string,
      amount: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.stakeAsPool(
        stakerAddress,
        amount,
        signer,
        config
      );
      return tx;
    },
    registerPool: async (
      poolAddress: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.registerPool(poolAddress, signer, config);
      return tx;
    },
    transferRewardYield: async (
      poolAddress: string,
      toAddress: string,
      amount: string
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.transferRewardYield(
        poolAddress,
        toAddress,
        amount,
        config
      );
      return tx;
    },
    changePoolWeight: async (
      poolAddress: string,
      weight: string,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.changePoolWeight(
        poolAddress,
        weight,
        signer,
        config
      );
      return tx;
    },

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
    getRewardTokensPerBloc: async (): Promise<ethers.BigNumber> => {
      const factory = await getPoolFactory(config);
      const tokensPerBlock = await factory.getRewardTokensPerBlock();
      return tokensPerBlock;
    },
    // Utility Functions
    calculateRewards: (
      stakingAmount: number,
      lockPeriodDays: number,
      asApr: boolean
    ): number => {
      if (lockPeriodDays < 0 || lockPeriodDays > 365)
        throw Error("Locking period must be between 0 and 365 days");

      const rewards = calculateRewards(stakingAmount, lockPeriodDays, asApr);
      return rewards;
    },
  };

  return instance;
};

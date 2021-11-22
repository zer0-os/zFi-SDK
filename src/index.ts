import * as ethers from "ethers";
import * as actions from "./actions";
import { getTokenPool, getLiquidityPool, calculateRewards, getPoolFactory } from "./helpers";
import { Config, Deposit, Instance, PoolData, User } from "./types";

export const createInstance = (config: Config): Instance => {
  const instance: Instance = {
    stake: async (
      amount: string,
      lockUntil: ethers.BigNumber,
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
      lockUntil: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      const liquidityPool = await getLiquidityPool(config);
      const tx = await liquidityPool
        .connect(signer)
        .updateStakeLock(depositId, lockUntil);
      return tx;
    },
    transferRewardYield: async (
      toAddress: string,
      amount: ethers.BigNumber
    ): Promise<ethers.ContractTransaction> => {
      const tx = await actions.transferRewardYield(
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
      // If address has no associated stake it returns 0
      const pendingRewards = await actions.pendingYieldRewards(
        address,
        config
      );
      return pendingRewards;
    },
    getDeposit: async (
      depositId: string,
      address: string
    ): Promise<Deposit> => {
      const liquidityPool = await getLiquidityPool(config);
      const deposit: Deposit = await liquidityPool.getDeposit(address, depositId);
      return deposit;
    },
    getDepositsLength: async (address: string): Promise<ethers.BigNumber> => {
      const liquidityPool = await getLiquidityPool(config);
      const depositsLength = await liquidityPool.getDepositsLength(address);
      return depositsLength;
    },
    getAllDeposits: async (address: string): Promise<Deposit[]> => {
      const deposits = await actions.getAllDeposits(address, config);
      return deposits;
    },
    getUser: async (address: string): Promise<User> => {
      const liquidityPool = await getLiquidityPool(config);
      const user: User = await liquidityPool.users(address);
      return user;
    },
    getPoolToken: async (): Promise<string> => {
      const tokenPool = await getTokenPool(config);
      const poolToken = await tokenPool.poolToken();
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
      const liquidityPool = await getLiquidityPool(config);
      const lastYieldDistribution = await liquidityPool.lastYieldDistribution();
      return lastYieldDistribution;
    },
    getLiquidityPoolWeight: async (): Promise<number> => {
      const liquidityPool = await getLiquidityPool(config);
      const weight = await liquidityPool.weight();
      return weight;
    },
    getTokenPoolWeight: async (): Promise<number> => {
      const tokenPool = await getTokenPool(config);
      const weight = await tokenPool.weight();
      return weight;
    },
    getRewardTokensPerBlock: async (): Promise<ethers.BigNumber> => {
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

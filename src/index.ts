import * as ethers from "ethers";
import * as actions from "./actions";
import { getCorePool, getPoolFactory } from "./helpers";
import {
  Config,
  Deposit,
  FactoryInstance,
  Instance,
  PoolData,
  PoolInstance,
  SubConfig,
  User,
  UserValue,
} from "./types";

export const createInstance = (config: Config): Instance => {
  // Consumer will do `sdkInstance.wildPool.stake()`
  const factoryConfig: SubConfig = {
    address: config.factoryAddress,
    provider: config.provider,
  };
  const wildConfig: SubConfig = {
    address: config.wildPoolAddress,
    provider: config.provider,
  };
  const liquidityConfig: SubConfig = {
    address: config.lpTokenPoolAddress,
    provider: config.provider,
  };

  const factory = getFactoryInstance(factoryConfig);
  const wildPool = getPoolInstance(wildConfig);
  const liquidityPool = getPoolInstance(liquidityConfig);

  return {
    factory: factory,
    wildPool: wildPool,
    liquidityPool: liquidityPool,
  };
};

// The zFI SDK requires that you create an instance once for every staking pool.
// As we have one WILD/ETH LP staking pool, and one WILD staking pool, there must be two instances
const getPoolInstance = (config: SubConfig): PoolInstance => {
  const instance: PoolInstance = {
    approve: async (signer: ethers.Signer) => {
      // have the signer call to ERC20 approve for the pool address
      await actions.approve(signer, config);
    },
    allowance: async (signer: ethers.Signer): Promise<ethers.ContractTransaction> => {
      const tx = await actions.allowance(signer, config);
      return tx;
    },
    stake: async (
      amount: string,
      lockUntil: ethers.BigNumber,
      signer: ethers.Signer
    ): Promise<ethers.ContractTransaction> => {
      // ZStakeCorePool of either ETH/WILD liquidity tokens or WILD
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
      const tx = await actions.updateStakeLock(
        depositId,
        lockUntil,
        signer,
        config
      );
      return tx;
    },
    pendingYieldRewards: async (address: string): Promise<ethers.BigNumber> => {
      // If address has no associated stake it will return 0
      const pendingRewards = await actions.pendingYieldRewards(address, config);
      return pendingRewards;
    },
    getAllDeposits: async (address: string): Promise<Deposit[]> => {
      const deposits = await actions.getAllDeposits(address, config);
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
    getLastYieldDistribution: async (): Promise<ethers.BigNumber> => {
      const corePool = await getCorePool(config);
      const lastYieldDistribution = await corePool.lastYieldDistribution();
      return lastYieldDistribution;
    },
    getLiquidityPoolWeight: async (): Promise<number> => {
      const corePool = await getCorePool(config);
      const weight = await corePool.weight();
      return weight;
    },
    getTokenPoolWeight: async (): Promise<number> => {
      const corePool = await getCorePool(config);
      const weight = await corePool.weight();
      return weight;
    },
    getRewardTokensPerBlock: async (): Promise<ethers.BigNumber> => {
      const factory = await getPoolFactory(config);
      const tokensPerBlock = await factory.getRewardTokensPerBlock();
      return tokensPerBlock;
    },
    // Calculate user value locked
    calculateUserValueLocked: async (
      userAddress: string
    ): Promise<UserValue> => {
      // Will return a user's total deposit value that is both locked and unlocked
      // e.g. [valueLocked, valueUnlocked]
      return await actions.calculateUserValueLocked(userAddress, config);
    },
  };

  return instance;
};

const getFactoryInstance = (config: SubConfig) => {
  const instance: FactoryInstance = {
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
  };
  return instance;
};

import { BigNumber, ethers } from "ethers";

export interface FactoryConfig {
  address: string;
  provider: ethers.providers.Provider;
}
export interface PoolConfig extends FactoryConfig {
  subgraphUri: string;
}

export interface Config {
  wildPoolAddress: string;
  lpTokenPoolAddress: string;
  factoryAddress: string;
  subgraphUri: string;
  provider: ethers.providers.Provider;
}

export interface Instance {
  factory: FactoryInstance;
  wildPool: PoolInstance;
  liquidityPool: PoolInstance;
}

export interface FactoryInstance {
  getPoolAddress: (poolToken: string) => Promise<string>;
  getPoolData: (poolAddress: string) => Promise<PoolData>;
  getRewardTokensPerBlock: () => Promise<ethers.BigNumber>;
}

export interface PoolInstance {
  address: string;
  listDeposits: () => Promise<Deposit[]>;
  getAllDeposits: (accountAddress: string) => Promise<Deposit[]>;
  listRewards: () => Promise<Reward[]>;
  getAllRewards: (accountAddress: string) => Promise<Reward[]>;
  approve: (signer: ethers.Signer) => Promise<ethers.ContractTransaction>;
  allowance: (signer: ethers.Signer) => Promise<ethers.BigNumber>;
  stake: (
    amount: string,
    lockUntil: ethers.BigNumber,
    signer: ethers.Signer
  ) => Promise<ethers.ContractTransaction>;
  unstake: (
    depositId: string,
    amount: string,
    signer: ethers.Signer
  ) => Promise<ethers.ContractTransaction>;
  processRewards: (
    signer: ethers.Signer
  ) => Promise<ethers.ContractTransaction>;
  updateStakeLock: (
    depositId: string,
    lockUntil: ethers.BigNumber,
    signer: ethers.Signer
  ) => Promise<ethers.ContractTransaction>;
  pendingYieldRewards: (address: string) => Promise<ethers.BigNumber>;
  getPoolToken: () => Promise<string>;
  userValueStaked: (address: string) => Promise<UserValue>;
  poolApr: () => Promise<number>;
  poolTvl: () => Promise<TotalValueLocked>;
  getUser: (address: string) => Promise<User>;
  getAllDepositsLegacy: (address: string) => Promise<LegacyDeposit[]>;
}

export interface Deposit {
  by: string;
  depositId: string;
  tokenAmount: string;
  lockedFrom: string;
  lockedUntil: string;
  pool: string;
  timestamp: string;
}

export interface LegacyDeposit {
  depositId: number;
  tokenAmount: BigNumber;
  weight: BigNumber;
  lockedFrom: BigNumber;
  lockedUntil: BigNumber;
  isYield: boolean;
}

export interface Reward {
  for: string;
  tokenAmount: string;
  pool: string;
  timestamp: string;
}

export enum NetworkChainId {
  mainnet = 1,
  rinkeby = 4,
  kovan = 42,
}

// Intentionally ignore the Deposit[] prop associated with a user
// we can get that information directly with `getAllDeposits`
export interface User {
  tokenAmount: BigNumber;
  totalWeight: BigNumber;
  subYieldRewards: BigNumber;
}

export interface UserValue {
  userValueLocked: ethers.BigNumber;
  userValueLockedUsd: number;
  userValueUnlocked: ethers.BigNumber;
  userValueUnlockedUsd: number;
}

export interface PoolData {
  poolToken: string;
  poolAddress: string;
  weight: number;
  isFlashPool: boolean;
}

export interface TotalValueLocked {
  numberOfTokens: number;
  valueOfTokensUSD: number;
}

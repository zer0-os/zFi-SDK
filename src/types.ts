import { BigNumber, ethers } from "ethers";

export interface SubConfig {
  address: string;
  provider: ethers.providers.Provider;
}

export interface Config {
  wildPoolAddress: string;
  lpTokenPoolAddress: string;
  factoryAddress: string;
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
  getAllDeposits: (address: string) => Promise<Deposit[]>;
  getUser: (address: string) => Promise<User>;
  getPoolToken: () => Promise<string>;
  userValueStaked: (address: string) => Promise<UserValue>;
  poolApr: () => Promise<number>;
  poolTvl: () => Promise<TotalValueLocked>;
}

export interface Deposit {
  depositId: number;
  tokenAmount: BigNumber;
  weight: BigNumber;
  lockedFrom: BigNumber;
  lockedUntil: BigNumber;
  isYield: boolean;
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

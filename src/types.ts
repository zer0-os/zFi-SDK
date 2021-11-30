import { BigNumber, ethers } from "ethers";

export interface SubConfig {
  poolAddress: string;
  factoryAddress: string;
  provider: ethers.providers.Provider;
}

export interface Config {
  wildPoolAddress: string;
  liquidityPoolAddress: string,
  factoryAddress: string,
  provider: ethers.providers.Provider
}

export interface Instance {
  wildPool: PoolInstance,
  liquidityPool: PoolInstance
}

export interface PoolInstance {
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
  getPoolAddress: (poolToken: string) => Promise<string>;
  getPoolData: (poolAddress: string) => Promise<PoolData>;
  getLastYieldDistribution: () => Promise<ethers.BigNumber>;
  getLiquidityPoolWeight: () => Promise<number>;
  getTokenPoolWeight: () => Promise<number>;
  getRewardTokensPerBlock: () => Promise<ethers.BigNumber>;
  calculateUvl: (address: string) => Promise<ethers.BigNumber>;
}

export interface Deposit {
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

export interface PoolData {
  poolToken: string;
  poolAddress: string;
  weight: number;
  isFlashPool: boolean;
}

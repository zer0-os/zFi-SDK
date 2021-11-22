import { BigNumber, ethers } from "ethers";
import { ZStakePoolBase } from "./contracts/types";

export interface Config {
  liquidityPoolAddress: string;
  tokenPoolAddress: string;
  factoryAddress: string;
  provider: ethers.providers.Provider;
}

export interface Instance {
  stake: (
    amount: string,
    lockUntil: ethers.BigNumber,
    signer: ethers.Signer
  ) => Promise<ethers.ContractTransaction>;
  transferRewardYield: (
    toAddress: string,
    amount: ethers.BigNumber
  ) => Promise<ethers.ContractTransaction>;
  changePoolWeight: (
    poolAddress: string,
    weight: string,
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
  getDeposit: (depositId: string, address: string) => Promise<Deposit>;
  getDepositsLength: (address: string) => Promise<ethers.BigNumber>;
  getAllDeposits: (address: string) => Promise<Deposit[]>;
  getUser: (address: string) => Promise<User>;
  getPoolToken: () => Promise<string>;
  getPoolAddress: (poolToken: string) => Promise<string>;
  getPoolData: (poolAddress: string) => Promise<PoolData>;
  getLastYieldDistribution: () => Promise<ethers.BigNumber>;
  getLiquidityPoolWeight: () => Promise<number>;
  getTokenPoolWeight: () => Promise<number>;
  getRewardTokensPerBlock: () => Promise<ethers.BigNumber>;
  calculateRewards: (
    stakingAmount: number,
    lockPeriodDays: number,
    asPercent: boolean
  ) => number;
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

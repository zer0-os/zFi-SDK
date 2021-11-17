import { BigNumber, ethers } from "ethers";
import { ZStakePoolBase } from "./contracts/types";

export interface Config {
  liquidityPoolAddress: string;
  wildPoolAddress: string;
  web3Provider: ethers.providers.Web3Provider;
}

export interface Instance {
  // TODO
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

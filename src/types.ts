import { ethers } from "ethers";
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
  tokenAmount: ethers.BigNumber;
  weight: ethers.BigNumber;
  lockedFrom: ethers.BigNumber;
  lockedUntil: ethers.BigNumber;
  isYield: boolean;
}

export interface User {
  tokenAmount: ethers.BigNumber;
  totalWeight: ethers.BigNumber;
  subYieldRewards: ethers.BigNumber;
  subVaultRewards: ethers.BigNumber;
  deposits: Deposit[];

}
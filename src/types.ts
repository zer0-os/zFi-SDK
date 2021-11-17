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
export interface UserObject {
  tokenAmount: BigNumber;
  totalWeight: BigNumber;
  subYieldRewards: BigNumber;
  deposits: Deposit[];
}

type Types = [BigNumber, BigNumber, BigNumber];

export type User = Types & UserObject;

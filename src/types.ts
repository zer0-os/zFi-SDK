import { ethers } from "ethers";
import { ZStakePoolBase } from "./contracts/types";

export interface Config {
  liquidityPoolAddress: string;
  wildPoolAddress: string;
  web3Provider: ethers.providers.Web3Provider;
}

export interface Instance {
  getZStakePoolBaseContract: (address: string, web3Provider: ethers.providers.Web3Provider) => Promise<ZStakePoolBase>;
}
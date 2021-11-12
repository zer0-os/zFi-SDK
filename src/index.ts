import * as ethers from "ethers";
import { Config, Instance } from "./types";
import { ZStakePoolBase } from "./contracts/types";
import { getZStakePoolBaseContract } from "./contracts";

export const createInstance = (config: Config): Instance => {

  const instance: Instance = {
    // Change this to be utility functions that then get contract instances as appropriate
    // but for now we just create an instance to make sure everything works
    // getZStakePoolBaseContract: async () => {}
    getZStakePoolBaseContract: async (address: string, web3Provider: ethers.providers.Web3Provider): Promise<ZStakePoolBase> => {
      const instance: ZStakePoolBase = await getZStakePoolBaseContract(address, web3Provider);
      
      // WIP Sample usage of instantiated contract
      // TODO add higher level utility functions for SDK instance
      // and remove direct calls to contract from here
      const amount = ethers.BigNumber.from("100");
      const lockUntil = ethers.BigNumber.from("365");
      instance.stake(amount, lockUntil, false);

      return instance;
    }

  }
  return instance;
}
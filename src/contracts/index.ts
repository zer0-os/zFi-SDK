import * as ethers from "ethers";
import {
  ZStakeAware,
  ZStakeAware__factory,
  ZStakeCorePool,
  ZStakeCorePool__factory,
  ZStakePoolBase,
  ZStakePoolBase__factory,
  ZStakePoolFactory,
  ZStakePoolFactory__factory,
} from "./types";

export const getZStakePoolBase = async (
  address: string,
  web3Provider: ethers.providers.Web3Provider
): Promise<ZStakePoolBase> => {
  const contract = ZStakePoolBase__factory.connect(address, web3Provider);
  return contract;
};

export const getZStakeCorePool = async (
  address: string,
  web3Provider: ethers.providers.Web3Provider
): Promise<ZStakeCorePool> => {
  const contract = ZStakeCorePool__factory.connect(address, web3Provider);
  return contract;
};

export const getZStakeAware = async (
  address: string,
  web3Provider: ethers.providers.Web3Provider
): Promise<ZStakeAware> => {
  const contract = ZStakeAware__factory.connect(address, web3Provider);
  return contract;
};

export const getZStakePoolFactory = async (
  address: string,
  web3Provider: ethers.providers.Web3Provider
): Promise<ZStakePoolFactory> => {
  const contract = ZStakePoolFactory__factory.connect(address, web3Provider);
  return contract;
};

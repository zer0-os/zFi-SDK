import * as ethers from "ethers";
import {
  ZStakeCorePool,
  ZStakeCorePool__factory,
  ZStakePoolBase,
  ZStakePoolBase__factory,
  ZStakePoolFactory,
  ZStakePoolFactory__factory,
} from "./types";

export * from "./types"

export const getZStakePoolBase = async (
  address: string,
  provider: ethers.providers.Provider
): Promise<ZStakePoolBase> => {
  const contract = ZStakePoolBase__factory.connect(address, provider);
  return contract;
};

export const getZStakeCorePool = async (
  address: string,
  provider: ethers.providers.Provider
): Promise<ZStakeCorePool> => {
  const contract = ZStakeCorePool__factory.connect(address, provider);
  return contract;
};

export const getZStakePoolFactory = async (
  address: string,
  provider: ethers.providers.Provider
): Promise<ZStakePoolFactory> => {
  const contract = ZStakePoolFactory__factory.connect(address, provider);
  return contract;
};

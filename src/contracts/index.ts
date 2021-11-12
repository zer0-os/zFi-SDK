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

export const getZStakePoolBaseContract = async (
  address: string,
  web3Provider: ethers.providers.Web3Provider
): Promise<ZStakePoolBase> => {
  const contract = ZStakePoolBase__factory.connect(address, web3Provider);
  return contract;
};

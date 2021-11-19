import { ethers } from "ethers";
import { getPoolFactory } from "../helpers";
import { Config } from "../types";

export const registerPool = async (
  poolAddress: string,
  signer: ethers.Signer,
  config: Config
) => {
  const factory = await getPoolFactory(config);
  const poolAddressCheck = await factory.pools(poolAddress);

  if (poolAddressCheck !== "0") throw Error("This pool is already registered");
  
  const tx = factory.connect(signer).registerPool(poolAddress);
  return tx;
};

import { ethers } from "ethers";
import { getPoolFactory } from "../helpers";
import { SubConfig } from "../types";

export const changePoolWeight = async (
  poolAddress: string,
  weight: ethers.BigNumber,
  signer: ethers.Signer,
  config: SubConfig
): Promise<ethers.ContractTransaction> => {
  if (!poolAddress || poolAddress.length !== 42)
    throw Error("Must provide a valid pool address");

  if (
    weight.lte(ethers.BigNumber.from("0")) ||
    weight.gt(ethers.BigNumber.from(Number.MAX_SAFE_INTEGER - 1))
  )
    throw Error("Must provide a valid pool weight");

  const factory = await getPoolFactory(config);
  const signerAddress = await signer.getAddress();

  const owner = await factory.owner();

  if (owner !== signerAddress)
    throw Error("Only the pool factory owner can modify the pool weight");

  const tx = await factory
    .connect(signer)
    .changePoolWeight(poolAddress, ethers.BigNumber.from(weight));
  return tx;
};

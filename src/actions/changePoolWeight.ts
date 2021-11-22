import { ethers } from "ethers";
import { getPoolFactory } from "../helpers";
import { Config } from "../types";

export const changePoolWeight = async (
  poolAddress: string,
  weight: string,
  signer: ethers.Signer,
  config: Config
): Promise<ethers.ContractTransaction> => {
  const factory = await getPoolFactory(config);
  const signerAddress = await signer.getAddress();

  const owner = await factory.owner();

  if (owner !== signerAddress)
    throw Error(
      "Only the pool factory owner can modify the pool weight"
    );

  const tx = await factory
    .connect(signer)
    .changePoolWeight(poolAddress, weight);
  return tx;
};

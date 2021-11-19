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

  const exists = await factory.poolExists(signerAddress);
  const owner = await factory.owner();

  if (!exists && owner !== signerAddress)
    throw Error(
      "Function must be called by either the pool factory owner or the pool itself"
    );

  const tx = await factory
    .connect(signer)
    .changePoolWeight(poolAddress, weight);
  return tx;
};

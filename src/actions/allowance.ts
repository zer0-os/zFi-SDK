import * as ethers from "ethers";
import { getCorePool } from "../helpers";
import { SubConfig } from "../types";

// Add ERC20 `allowance`
const erc20Abi = ["function allowance(address _owner, address _spender) public"];

export const allowance = async (signer: ethers.Signer, config: SubConfig): Promise<ethers.ContractTransaction> => {
  const pool = await getCorePool(config);
  const poolToken = await pool.poolToken();
  const signerAddress = await signer.getAddress();

  const tokenInstance = new ethers.Contract(poolToken, erc20Abi, config.provider);
  const tx = await tokenInstance.allowance(signerAddress, config.address);
  return tx;
}

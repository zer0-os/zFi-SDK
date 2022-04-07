import * as ethers from "ethers";
import { getCorePool } from "../helpers";
import { PoolConfig } from "../types";

// Add ERC20 `allowance`
const erc20Abi = ["function allowance(address _owner, address _spender) public view returns (uint256)"];

export const allowance = async (signer: ethers.Signer, config: PoolConfig): Promise<ethers.BigNumber> => {
  const pool = await getCorePool(config);
  const poolToken = await pool.poolToken();
  const signerAddress = await signer.getAddress();

  const tokenInstance = new ethers.Contract(poolToken, erc20Abi, config.provider);
  const allowance = await tokenInstance.allowance(signerAddress, config.address);
  return allowance;
}

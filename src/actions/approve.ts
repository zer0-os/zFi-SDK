import * as ethers from "ethers";
import { getCorePool, getPoolFactory } from "../helpers";
import { SubConfig } from "../types";

// Add ERC20 `approve`, signature is enough
const erc20Abi = ["function approve(address spender, uint256 amount) public"];

// e.g. token.connect(staker).approve(poolAddress, amount)
export const approve = async (signer: ethers.Signer, config: SubConfig) => {
  const pool = await getCorePool(config);
  const poolToken = await pool.poolToken();

  const tokenInstance = new ethers.Contract(poolToken, erc20Abi, config.provider);
  await tokenInstance.connect(signer)
    .approve(config.address, ethers.constants.MaxUint256);
}

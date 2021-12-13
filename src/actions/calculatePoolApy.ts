// import CoinGecko from "coingecko-api"
import * as ethers from "ethers";
import { getPoolFactory } from "../helpers";
import { SubConfig } from "../types";

export const calculatePoolApy = async (config: SubConfig): Promise<any> => {
  const factory = await getPoolFactory(config);
  // const rewardsPerBlock = await factory.getRewardTokensPerBlock();
  // const ethMantissa = ethers.utils.parseUnits("1", 18);
  // const blocksPerDay = 6570;
  // const daysPerYear = 365;
  const ethMantissa = 1e18;
  const blocksPerDay = 6570; // 13.15 seconds per block
  const daysPerYear = 365;

  const supplyRatePerBlock = 37893566; // 1,000,000
  const supplyApy = (((Math.pow((supplyRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear))) - 1) * 100;
  console.log(`Supply APY for ETH ${supplyApy} %`);

  // ((((Rate / ETH Mantissa * Blocks Per Day + 1) ^ Days Per Year)) - 1) * 100
  // const supplyApy = ((Math.pow((rewardsPerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear)) - 1) * 100;
  // Calc BN equivalent ()
  // const apy = (((rewardsPerBlock.div(ethMantissa.mul(blocksPerDay).add(1))).pow(daysPerYear)).sub(1)).mul(100);

  // console.log(apy);
  // console.log(apy.toString());
  return supplyApy;  
  
  // const client = new CoinGecko();
  // const response = await client.coins.fetch("ethereum",{ market_data: true });
  // // const response = await client.coins.all()
  // console.log(response);
  // return response.data;
}
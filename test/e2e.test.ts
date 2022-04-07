/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";

import { Config } from "../src/types";
import * as helpers from "../src/helpers";
import { createInstance } from "../src";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const provider = new ethers.providers.StaticJsonRpcProvider(
    process.env.INFURA_URL,
    4
  );
  it("stuff", async () => {

  })
  it("Runs a full scenario through the SDK", async () => {
    const config: Config = {
      wildPoolAddress: "0xE0Bb298Afc5dC12918d02732c824DA44e7D61E2a",
      lpTokenPoolAddress: "0xe7BEeedAf11eE695C4aE64A01b24F3F7eA294aB6",
      factoryAddress: "0xb1d051095B6b2f6C93198Cbaa9bb7cB2d607215C",
      subgraphUri: "",
      provider: provider,
    };

    const mainPk = process.env.MAIN_PRIVATE_KEY;
    if(!mainPk) throw Error("no main pk")

    const main = new ethers.Wallet(mainPk, provider);

    const sdk = createInstance(config);
    const token = await sdk.wildPool.getPoolToken();
    const data = await sdk.factory.getPoolData(token);
    console.log(data);

    const user = await sdk.wildPool.getUser("0xaE3153c9F5883FD2E78031ca2716520748c521dB");

    const allDeposits = await sdk.wildPool.getAllDeposits("0xaE3153c9F5883FD2E78031ca2716520748c521dB")
    console.log(allDeposits);
    const futureDate = "1649273303" // Date.now() / 1000
    const tx = await sdk.wildPool.updateStakeLock("0", ethers.BigNumber.from("1947997910"), main)

    const receipt = await tx?.wait(1)
    const poolApr = await sdk.wildPool.poolApr();
    console.log(poolApr);

    const poolTvl = await sdk.wildPool.poolTvl();
    console.log(poolTvl);

    const lpPoolApr = await sdk.liquidityPool.poolApr();
    console.log(lpPoolApr)

    const factory = await helpers.getPoolFactory({
      address: config.factoryAddress,
      provider,
    });

    const tw = await factory.totalWeight();
    console.log(tw);

    const pk = process.env.TESTNET_PRIVATE_KEY;
    if (!pk) throw Error("no key");
    const wallet = new ethers.Wallet(pk, provider);

    try {
      const tx = await sdk.wildPool.stake(
        ethers.utils.parseEther("12.4").toString(),
        ethers.BigNumber.from("10441982"),
        wallet
      );

      console.log(tx.hash);
      const receipt = await tx.wait(1);
      console.log(receipt);
    } catch (e) {
      console.log(e);
    }
  });
});

/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { ImportMock } from "ts-mock-imports";

import { Config, Deposit, SubConfig } from "../src/types";
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
  it("Runs a full scenario through the SDK", async () => {
    const config: Config = {
      wildPoolAddress: "0xE0Bb298Afc5dC12918d02732c824DA44e7D61E2a",
      lpTokenPoolAddress: "0xe7BEeedAf11eE695C4aE64A01b24F3F7eA294aB6",
      factoryAddress: "0xb1d051095B6b2f6C93198Cbaa9bb7cB2d607215C",
      provider: provider,
    };



    const sdk = createInstance(config);

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

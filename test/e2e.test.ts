/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";

import { Config, Deposit, Instance, LegacyDeposit, Reward } from "../src/types";
import * as helpers from "../src/helpers";
import { createInstance } from "../src";
import { createClient } from "../src/subgraph";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const mainTest = "0xaE3153c9F5883FD2E78031ca2716520748c521dB";
  const provider = new ethers.providers.StaticJsonRpcProvider(
    process.env.INFURA_URL,
    4
  );
  const config: Config = {
    wildPoolAddress: "0xE0Bb298Afc5dC12918d02732c824DA44e7D61E2a",
    lpTokenPoolAddress: "0xe7BEeedAf11eE695C4aE64A01b24F3F7eA294aB6",
    factoryAddress: "0xb1d051095B6b2f6C93198Cbaa9bb7cB2d607215C",
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zfi-rinkeby",
    provider: provider,
  };
  it("Tests subgraph functionality", async () => {
    const subgraphClient = createClient(config.subgraphUri);

    const depositsInWildPool: Deposit[] = await subgraphClient.listDeposits(
      config.wildPoolAddress
    );
    expect(depositsInWildPool.length).to.be.gt(0);

    const depositsInLpTokenPool: Deposit[] = await subgraphClient.listDeposits(
      config.lpTokenPoolAddress
    );
    expect(depositsInLpTokenPool.length).to.be.gt(0);

    const depositsByAccount: Deposit[] =
      await subgraphClient.listDepositsByAccount(
        config.wildPoolAddress,
        mainTest
      );
    expect(depositsByAccount.length).to.be.gt(0);

    const rewards: Reward[] = await subgraphClient.listRewards(
      config.wildPoolAddress
    );
    expect(rewards.length).to.be.gt(0);

    const accountRewards: Reward[] = await subgraphClient.listRewardsByAccount(
      config.wildPoolAddress,
      mainTest
    );
    expect(accountRewards.length).to.be.eq(0);
  });
  it("Runs a full scenario through the SDK", async () => {
    const mainPk = process.env.MAIN_PRIVATE_KEY;
    if (!mainPk) throw Error("No private key found");

    const main = new ethers.Wallet(mainPk, provider);

    const sdk = createInstance(config);
    const token = await sdk.wildPool.getPoolToken();
    const data = await sdk.factory.getPoolData(token);
    console.log(data);

    const user = await sdk.wildPool.getUser(mainTest);

    // Direct deposits do not have a timestamp, they come directly from the staking contract
    const allDepositsLegacy: LegacyDeposit[] =
      await sdk.wildPool.getAllDepositsLegacy(mainTest);
    console.log(allDepositsLegacy);

    // Deposits scraped by the subgraph have a timestamp
    const allDeposits: Deposit[] = await sdk.wildPool.getAllDeposits(mainTest);
    console.log(allDeposits);

    const poolApr = await sdk.wildPool.poolApr();
    console.log(poolApr);

    const poolTvl = await sdk.wildPool.poolTvl();
    console.log(poolTvl);

    const lpPoolApr = await sdk.liquidityPool.poolApr();
    console.log(lpPoolApr);

    const uvl = await sdk.wildPool.userValueStaked(mainTest);
    console.log(uvl);

    const factory = await helpers.getPoolFactory({
      address: config.factoryAddress,
      provider,
    });

    const tw = await factory.totalWeight();
    console.log(tw);

    const rewardsPerBlock = await factory.getRewardTokensPerBlock();
    console.log(rewardsPerBlock);

    const pk = process.env.TESTNET_PRIVATE_KEY;
    if (!pk) throw Error("no key");
    const wallet = new ethers.Wallet(pk, provider);

    // try {
    //   const tx = await sdk.wildPool.stake(
    //     ethers.utils.parseEther("12.4").toString(),
    //     ethers.BigNumber.from("10441982"),
    //     wallet
    //   );

    //   console.log(tx.hash);
    //   const receipt = await tx.wait(1);
    //   console.log(receipt);
    // } catch (e) {
    //   console.log(e);
    // }
  });
});

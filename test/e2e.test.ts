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
  const astroTest = "0x35888AD3f1C0b39244Bb54746B96Ee84A5d97a53";
  const provider = new ethers.providers.StaticJsonRpcProvider(
    process.env.INFURA_URL,
    5
  );
  const config: Config = {
    wildPoolAddress: "0x376030f58c76ECC288a4fce8F88273905544bC07",
    lpTokenPoolAddress: "0xCa0F071fcf5b36436F75E422b5Bd23666015b9f9",
    factoryAddress: "0xAeEaC5F790dD98FD7166bBD50d9938Bf542AFeEf",
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zfi-goerli",
    provider: provider,
  };
  it("Tests subgraph functionality", async () => {
    const subgraphClient = createClient(config.subgraphUri);

    const depositsInWildPool: Deposit[] = await subgraphClient.listDeposits(
      config.wildPoolAddress
    );
    expect(depositsInWildPool.length).to.be.not.null;

    const depositsInLpTokenPool: Deposit[] = await subgraphClient.listDeposits(
      config.lpTokenPoolAddress
    );
    expect(depositsInLpTokenPool.length).to.be.not.null;

    const depositsByAccount: Deposit[] =
      await subgraphClient.listDepositsByAccount(
        config.wildPoolAddress,
        astroTest
      );
    expect(depositsByAccount.length).to.be.not.null;

    const rewards: Reward[] = await subgraphClient.listRewards(
      config.wildPoolAddress
    );
    expect(rewards.length).to.be.not.null;

    const accountRewards: Reward[] = await subgraphClient.listRewardsByAccount(
      config.wildPoolAddress,
      astroTest
    );
    expect(accountRewards.length).to.be.not.null;
  });
  it("Runs a full scenario through the SDK", async () => {
    const mainPk = process.env.MAIN_PRIVATE_KEY;
    if (!mainPk) throw Error("No private key found");

    const main = new ethers.Wallet(mainPk, provider);

    const sdk = createInstance(config);
    const token = await sdk.wildPool.getPoolToken();
    const data = await sdk.factory.getPoolData(token);
    console.log(data);

    const user = await sdk.wildPool.getUser(astroTest);

    // Direct deposits do not have a timestamp, they come directly from the staking contract
    const allDepositsLegacy: LegacyDeposit[] =
      await sdk.wildPool.getAllDepositsLegacy(astroTest);
    console.log(allDepositsLegacy);

    // Deposits scraped by the subgraph have a timestamp
    const allDeposits: Deposit[] = await sdk.wildPool.getAllDeposits(astroTest);
    console.log(allDeposits);

    const poolApr = await sdk.wildPool.poolApr();
    console.log(poolApr);

    const poolTvl = await sdk.wildPool.poolTvl();
    console.log(poolTvl);

    const lpPoolApr = await sdk.liquidityPool.poolApr();
    console.log(lpPoolApr);

    const uvl = await sdk.wildPool.userValueStaked(astroTest);
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

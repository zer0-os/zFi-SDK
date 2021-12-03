// create instances of the ZFI contracts with ethers Contract
// and the Kovan deployed addresses.

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { ImportMock } from "ts-mock-imports";

import { Config, SubConfig } from "../src/types";
import { createInstance } from "../src";
import * as actions from "../src/actions";
import * as helpers from "../src/helpers";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

import * as zStakePoolFactoryArtifact from "../abi/zStakePoolFactory.json";
import * as zStakeCorePoolArtifact from "../abi/zStakeCorePool.json";
import { ZStakeCorePool, ZStakePoolFactory } from "../src/contracts";

// Addresses
const rewardTokenAddress = "0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F";
const rewardVaultAddress = "0x4Afc79F793fD4445f4fd28E3aa708c1475a43Fc4";

const config: Config = {
  provider: new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"]),
  factoryAddress: "0xf06C810c5ee8908A02dc5fE4D82D0578cA53a888",
  lpTokenPoolAddress: "0x69A38AF3D05C8E7A07Ddbe27Dd84Bd7DfCDb0BE6",
  wildPoolAddress: "0x9495B4e974E0e5b2865762d1fd5640E7A6c7Fa37",
};

describe("End to end test", () => {
  it("runs", async () => {
    const privateKey = process.env["WALLET_PRIVATE_KEY"];
    const deployerPrivateKey = process.env["DEPLOYER_PRIVATE_KEY"];
    if (!privateKey || !deployerPrivateKey) throw Error();

    // Setup accounts
    const staker = new ethers.Wallet(privateKey, config.provider);
    const stakerAddress = await staker.getAddress();

    // Create contracts for test interaction
    const factory: ZStakePoolFactory = new ethers.Contract(
      config.factoryAddress,
      zStakePoolFactoryArtifact.abi,
      config.provider
    ) as ZStakePoolFactory;

    const wildStakingPool: ZStakeCorePool = new ethers.Contract(
      config.wildPoolAddress,
      zStakeCorePoolArtifact.abi,
      config.provider
    ) as ZStakeCorePool;

    const lpStakingPool: ZStakeCorePool = new ethers.Contract(
      config.lpTokenPoolAddress,
      zStakeCorePoolArtifact.abi,
      config.provider
    ) as ZStakeCorePool;

    // Must manually set gas and nonce
    const nonce = (await staker.getTransactionCount()) + 1;
    console.log(nonce);
    const options = {
      gasPrice: 1000000000,
      gasLimit: 85000,
      nonce: nonce,
    };

    const blockNumber = await factory.blockNumber(options);

    // Confirm we're connected
    const rewardVault = await factory.rewardVault();
    expect(rewardVault).to.eq(rewardVaultAddress);

    // Stake
    const stakeAmount = ethers.BigNumber.from("100");
    const stakeLockUntil = blockNumber.add(ethers.BigNumber.from("1"));
    const tx1 = await wildStakingPool
      .connect(staker)
      .stake(stakeAmount, stakeLockUntil, options);

    // Wait 10 blocks
    await tx1.wait(10); // (might infinite loop?)

    // Check if any pending yield
    const rewards = await wildStakingPool.pendingYieldRewards(stakerAddress);
    if (rewards.eq(ethers.BigNumber.from("0")))
      // Check again in 10 blocks
      await tx1.wait(10);
    
    // Unstake
    const depositId = ethers.BigNumber.from("0");
    const tx2 = await wildStakingPool.connect(staker).unstake(0, stakeAmount);
    console.log(tx2.value);
  });
});

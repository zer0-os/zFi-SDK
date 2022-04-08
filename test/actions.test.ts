/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { ImportMock } from "ts-mock-imports";

import { Config, Deposit, PoolConfig } from "../src/types";
import * as actions from "../src/actions";
import * as helpers from "../src/helpers";
import { Console } from "console";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const config: Config = {
    provider: new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"], 4),
    factoryAddress: "0xb1d051095B6b2f6C93198Cbaa9bb7cB2d607215C",
    lpTokenPoolAddress: "0xe7BEeedAf11eE695C4aE64A01b24F3F7eA294aB6",
    wildPoolAddress: "0xE0Bb298Afc5dC12918d02732c824DA44e7D61E2a",
    subgraphUri: "https://api.thegraph.com/subgraphs/name/zer0-os/zfi-rinkeby",
  };

  // Dummy address pulled from Ethers VoidSigner docs
  const staker = new ethers.VoidSigner("0x8ba1f109551bD432803012645Ac136ddd64DBA72")
  
  const wildPoolConfig: PoolConfig = {
    address: config.wildPoolAddress,
    provider: config.provider,
    subgraphUri: config.subgraphUri
  };
  const lpPoolConfig: PoolConfig = {
    address: config.lpTokenPoolAddress,
    provider: config.provider,
    subgraphUri: config.subgraphUri
  }

  describe("calculatePoolApr", () => {
    it("runs", async () => {
      // Mock Factory
      const mockPoolFactory1 = {
        getRewardTokensPerBlock: () => { return ethers.utils.parseEther("4"); },
        totalWeight: () => { return ethers.BigNumber.from("1000"); },
        getPoolData: () => {
          return ["0x0", "0x1", ethers.BigNumber.from("150"), false]
        }
      }
      const mockFactory1 = ImportMock.mockFunction(
        helpers,
        "getPoolFactory",
        mockPoolFactory1
      );

      // Mock Pool
      const mockCorePool = {
        poolToken: () => { return "0x0" },
        // 18 decimals of precision, value pulled from etherscan
        poolTokenReserve: () => { return ethers.BigNumber.from("144062219306360209234098") },
        factory: () => { return "0x0" },
        provider: config.provider,
        address: config.wildPoolAddress
      }
      const mockPool = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      )

      // Call as wildStakingPool
      const wildApr = await actions.calculatePoolAnnualPercentageRate(false, wildPoolConfig);
      console.log(wildApr);

      mockFactory1.restore();

      // Mock Factory Again
      const mockPoolFactory2 = {
        getRewardTokensPerBlock: () => { return ethers.utils.parseEther("4"); },
        totalWeight: () => { return ethers.BigNumber.from("1000"); },
        getPoolData: () => {
          return ["0x0", "0x1", ethers.BigNumber.from("850"), false]
        }
      }

      ImportMock.mockFunction(
        helpers,
        "getPoolFactory",
        mockPoolFactory2
      );

      // Call as lpTokenStakingPool
      const lpTokenPoolApr = await actions.calculatePoolAnnualPercentageRate(true, lpPoolConfig);
      console.log(lpTokenPoolApr)
    });
  });
  describe("calculatePoolTotalValueLocked", () => {
    it("runs as wild pool", async () => {
      const res = await actions.calculatePoolTotalValueLocked(false, wildPoolConfig);
      console.log(res);
    });
    it("runs as lp token pool", async () => {
      const res = await actions.calculatePoolTotalValueLocked(true, lpPoolConfig);
      console.log(res);
    });
  })
  describe("calculateUserValueStaked", () => {
    it("Fails when a user provides an invalid address", async () => {
      const address = await staker.getAddress()
      await expect(
        actions.calculateUserValueStaked("0x0", false, wildPoolConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
    });
    it("runs against real values", async () => {
      ImportMock.restore();
      const brettsTestAddress = "0x0DDdA1dd73C063Af0A8D4Df0CDd2a6818685f9CE"
      const wildPool = await helpers.getCorePool(wildPoolConfig); 
      const depositsLength = await wildPool.getDepositsLength(brettsTestAddress);
      expect(depositsLength); // 69 from kovan etherscan

      const userValueLocked = await actions.calculateUserValueStaked(
        brettsTestAddress,
        false,
        wildPoolConfig
      );
      expect(userValueLocked);
    });
    it("Returns nothing when the user has no deposits", async () => {
      ImportMock.restore();
      const mockCorePool = {
        getDepositsLength: async () => {
          return ethers.BigNumber.from("0");
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      const stakerAddress = await staker.getAddress();
      const wildTokenDeposits = await actions.calculateUserValueStaked(
        stakerAddress,
        false,
        wildPoolConfig
      );
      const lpTokenDeposits = await actions.calculateUserValueStaked(
        stakerAddress,
        true,
        lpPoolConfig
      )
      const wildValue = wildTokenDeposits.userValueLocked.toNumber();
      expect(wildValue).to.equal(0);
      
      const lpTokenValue = lpTokenDeposits.userValueLocked.toNumber();
      expect(lpTokenValue).to.equal(0);
    });
    it("Doesn't add deposits that are locked", async () => {
      ImportMock.restore();
      const mockCorePool = {
        getDepositsLength: async () => {
          return ethers.BigNumber.from("1");
        },
        getDeposit: async () => {
          return {
            tokenAmount: ethers.BigNumber.from("100"),
            lockedUntil: ethers.BigNumber.from(Number.MAX_SAFE_INTEGER - 1),
          };
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      const stakerAddress = await staker.getAddress();

      // Call as wild token pool
      const wildTokenDeposits = await actions.calculateUserValueStaked(
        stakerAddress,
        false,
        wildPoolConfig
      );
      expect(wildTokenDeposits.userValueLocked.toNumber()).to.equal(100);
      expect(wildTokenDeposits.userValueUnlocked.toNumber()).to.equal(0);

      // Call as liquidity token pool
      const lpTokenDeposits = await actions.calculateUserValueStaked(
        stakerAddress,
        false,
        wildPoolConfig
      );
      expect(lpTokenDeposits.userValueLocked.toNumber()).to.equal(100);
      expect(lpTokenDeposits.userValueUnlocked.toNumber()).to.equal(0);
    });
    it("Adds deposits that are unlocked", async () => {
      ImportMock.restore();
      const mockCorePool = {
        getDepositsLength: async () => {
          return ethers.BigNumber.from("1");
        },
        getDeposit: async () => {
          return {
            tokenAmount: ethers.BigNumber.from("100"),
            lockedUntil: ethers.BigNumber.from("1"),
          };
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      const stakerAddress = await staker.getAddress();

      // Call as wild token pool
      const wildTokenDeposits = await actions.calculateUserValueStaked(
        stakerAddress,
        false,
        wildPoolConfig
      );
      expect(wildTokenDeposits.userValueLocked.toNumber()).to.equal(0);
      expect(wildTokenDeposits.userValueUnlocked.toNumber()).to.equal(100);

      // Call as liquidity token pool
      const lpTokenDeposits = await actions.calculateUserValueStaked(
        stakerAddress,
        false,
        wildPoolConfig
      );
      expect(lpTokenDeposits.userValueLocked.toNumber()).to.equal(0);
      expect(lpTokenDeposits.userValueUnlocked.toNumber()).to.equal(100);
    });
  });
  describe("changePoolWeight", () => {
    it("Fails when given an invalid pool address", async () => {
      ImportMock.restore();
      await expect(
        actions.changePoolWeight(
          "0x0",
          ethers.BigNumber.from("230"),
          staker,
          wildPoolConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool address");
      await expect(
        actions.changePoolWeight(
          "0x0",
          ethers.BigNumber.from("230"),
          staker,
          wildPoolConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool address");
    });
    it("Fails when given an invalid weight", async () => {
      await expect(
        actions.changePoolWeight(
          config.wildPoolAddress,
          ethers.BigNumber.from("0"),
          staker,
          wildPoolConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool weight");
      await expect(
        actions.changePoolWeight(
          config.wildPoolAddress,
          ethers.BigNumber.from("-1"),
          staker,
          wildPoolConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool weight");
    });
    it("Fails when called by an account that is not the owner of the given pool", async () => {
      ImportMock.restore();
      const mockPoolFactory = {
        connect: () => {
          return {
            changePoolWeight: () => {
              return "";
            },
          };
        },
        owner: () => {
          return "0x5eA627ba4cA4e043D38DE4Ad34b73BB4354daf8d";
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getPoolFactory",
        mockPoolFactory
      );
      await expect(
        actions.changePoolWeight(
          config.wildPoolAddress,
          ethers.BigNumber.from("230"),
          staker,
          wildPoolConfig
        )
      ).to.be.rejectedWith(
        "Only the pool factory owner can modify the pool weight"
      );
    });
  });
  describe("getAllDeposits", () => {
    it("Returns an empty array when no deposits are found", async () => {
      ImportMock.restore();
      const mockCorePool = {
        getDepositsLength: async () => {
          return ethers.BigNumber.from("0");
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      const deposits = await actions.getAllDepositsLegacy(
        config.wildPoolAddress,
        wildPoolConfig
      );
      expect(deposits.length).equals(0);
    });
    it("Returns a populated array when there are deposits", async () => {
      ImportMock.restore();
      const mockCorePool = {
        getDepositsLength: async () => {
          return ethers.BigNumber.from("1");
        },
        getDeposit: async () => {
          return { tokenAmount: ethers.BigNumber.from("100") };
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      const deposits = await actions.getAllDepositsLegacy(
        config.wildPoolAddress,
        wildPoolConfig
      );
      expect(deposits.length).equals(1);
    });
  });
  describe("pendingYieldRewards", () => {
    it("Fails when given an invalid address", async () => {
      await expect(
        actions.pendingYieldRewards("0x0", wildPoolConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
      await expect(
        actions.pendingYieldRewards("", wildPoolConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
    });
  });
  describe("processRewards", () => {
    it("Fails when there are no rewards to process", async () => {
      ImportMock.restore();
      const mockCorePool = {
        pendingYieldRewards: () => {
          return ethers.BigNumber.from("0");
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      await expect(
        actions.processRewards(staker, wildPoolConfig)
      ).to.be.rejectedWith("No rewards to process yet");
    });
  });
  describe("stake", () => {
    it("Fails when trying to stake nothing or a negative value", async () => {
      const lockUntil = ethers.BigNumber.from("1");
      await expect(
        actions.stake("0", lockUntil, staker, wildPoolConfig)
      ).to.be.rejectedWith("Cannot call to stake with no value given");
      await expect(
        actions.stake("-1", lockUntil, staker, wildPoolConfig)
      ).to.be.rejectedWith("Cannot call to stake with no value given");
    });
  });
  describe("unstake", () => {
    it("Fails when calling to unstake with 0 amount", async () => {
      await expect(
        actions.unstake("0", "0", staker, wildPoolConfig)
      ).to.be.rejectedWith("You can only unstake a non-zero amount of tokens");
    });
    it("Fails when calling to unstake with no deposits", async () => {
      ImportMock.restore();
      const mockCorePool = {
        connect: () => {
          return {
            unstake: () => {
              return "";
            },
          };
        },
        getDepositsLength: () => {
          return ethers.BigNumber.from("0");
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      await expect(
        actions.unstake("0", "1", staker, wildPoolConfig)
      ).to.be.rejectedWith("There are no deposits for you to unstake");
    });
    it("Fails when you try to unstake more than you have staked", async () => {
      ImportMock.restore();
      const mockCorePool = {
        connect: () => {
          return {
            unstake: () => {
              return "";
            },
          };
        },
        getDepositsLength: () => {
          return ethers.BigNumber.from("1");
        },
        getDeposit: () => {
          return { tokenAmount: ethers.BigNumber.from("5") };
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      await expect(
        actions.unstake("0", "10", staker, wildPoolConfig)
      ).to.be.rejectedWith(
        "You cannot unstake more than the original stake amount"
      );
    });
    it("Fails when you try to remove a deposit that is still locked", async () => {
      ImportMock.restore();
      const mockCorePool = {
        connect: () => {
          return {
            unstake: () => {
              return "";
            },
          };
        },
        getDepositsLength: () => {
          return ethers.BigNumber.from("1");
        },
        getDeposit: () => {
          return {
            tokenAmount: ethers.BigNumber.from("1"),
            lockedUntil: ethers.BigNumber.from("999999999999999"),
          };
        },
      };
      const mock = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      );
      await expect(
        actions.unstake("0", "1", staker, wildPoolConfig)
      ).to.be.rejectedWith(
        "You are not able to unstake when your deposit is still locked"
      );
    });
  });
  describe("updateStakeLock", () => {
    it("Fails when trying to stake nothing or a negative value", async () => {
      let lockUntil = ethers.BigNumber.from("0");
      await expect(
        actions.updateStakeLock("0", lockUntil, staker, wildPoolConfig)
      ).to.be.rejectedWith(
        "Cannot add zero or negative time to your locking period"
      );
      lockUntil = ethers.BigNumber.from("-1");
      await expect(
        actions.updateStakeLock("0", lockUntil, staker, wildPoolConfig)
      ).to.be.rejectedWith(
        "Cannot add zero or negative time to your locking period"
      );
    });
  });
});

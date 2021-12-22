import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as ethers from "ethers";
import * as dotenv from "dotenv";
import { ImportMock } from "ts-mock-imports";

import { Config, SubConfig } from "../src/types";
import * as actions from "../src/actions";
import * as helpers from "../src/helpers";
import { createInstance } from "../src";

chai.use(chaiAsPromised.default);
const expect = chai.expect;
dotenv.config();

describe("Test Custom SDK Logic", () => {
  const config: Config = {
    provider: new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"]),
    factoryAddress: "0xF133faFd49f4671ac63EE3a3aE7E7C4C9B84cE4a",
    lpTokenPoolAddress: "0x9E87a268D42B0Aba399C121428fcE2c626Ea01FF",
    wildPoolAddress: "0x3aC551725ac98C5DCdeA197cEaaE7cDb8a71a2B4",
  };

  // Dummy address pulled from Ethers VoidSigner docs
  const staker = new ethers.VoidSigner("0x8ba1f109551bD432803012645Ac136ddd64DBA72")
  const subConfig: SubConfig = {
    address: config.wildPoolAddress,
    provider: config.provider,
  };

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
      const wildApr = await actions.calculatePoolApr("mainnet", false, subConfig);
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

      const mockFactory2 = ImportMock.mockFunction(
        helpers,
        "getPoolFactory",
        mockPoolFactory2
      );

      const lpSubConfig = {
        address: config.lpTokenPoolAddress,
        provider: config.provider
      }

      // Call as lpTokenStakingPool
      const lpTokenPoolApr = await actions.calculatePoolApr("mainnet", true, lpSubConfig);
      console.log(lpTokenPoolApr)
    });
  });
  describe("calculatePoolTotalValueLocked", () => {
    it("runs as wild pool", async () => {
      const res = await actions.calculatePoolTotalValueLocked("mainnet", false, subConfig);
      console.log(res);
    });
    it("runs as lp token pool", async () => {
      const res = await actions.calculatePoolTotalValueLocked("mainnet", true, subConfig);
      console.log(res);
    });
  })
  describe("calculateUserValueStaked", () => {
    it("Fails when a user provides an invalid address", async () => {
      const address = await staker.getAddress()
      await expect(
        actions.calculateUserValueStaked("0x0", false, "mainnet", subConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
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
      const address = await staker.getAddress();
      const deposits = await actions.calculateUserValueStaked(
        address,
        false,
        "mainnet",
        subConfig
      );
      const value = deposits.userValueLocked.toNumber();
      expect(value).to.equal(0);
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
      const address = await staker.getAddress();
      const deposits = await actions.calculateUserValueStaked(
        address,
        false,
        "mainnet",
        subConfig
      );
      expect(deposits.userValueLocked.toNumber()).to.equal(100);
      expect(deposits.userValueUnlocked.toNumber()).to.equal(0);
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
      const address = await staker.getAddress();
      const deposits = await actions.calculateUserValueStaked(
        address,
        false,
        "mainnet",
        subConfig
      );
      expect(deposits.userValueLocked.toNumber()).to.equal(0);
      expect(deposits.userValueUnlocked.toNumber()).to.equal(100);
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
          subConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool address");
      await expect(
        actions.changePoolWeight(
          "0x0",
          ethers.BigNumber.from("230"),
          staker,
          subConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool address");
    });
    it("Fails when given an invalid weight", async () => {
      await expect(
        actions.changePoolWeight(
          config.wildPoolAddress,
          ethers.BigNumber.from("0"),
          staker,
          subConfig
        )
      ).to.be.rejectedWith("Must provide a valid pool weight");
      await expect(
        actions.changePoolWeight(
          config.wildPoolAddress,
          ethers.BigNumber.from("-1"),
          staker,
          subConfig
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
          subConfig
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
      const deposits = await actions.getAllDeposits(
        config.wildPoolAddress,
        subConfig
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
      const deposits = await actions.getAllDeposits(
        config.wildPoolAddress,
        subConfig
      );
      expect(deposits.length).equals(1);
    });
  });
  describe("pendingYieldRewards", () => {
    it("Fails when given an invalid address", async () => {
      await expect(
        actions.pendingYieldRewards("0x0", subConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
      await expect(
        actions.pendingYieldRewards("", subConfig)
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
        actions.processRewards(staker, subConfig)
      ).to.be.rejectedWith("No rewards to process yet");
    });
  });
  describe("stake", () => {
    it("Fails when trying to stake nothing or a negative value", async () => {
      const lockUntil = ethers.BigNumber.from("1");
      await expect(
        actions.stake("0", lockUntil, staker, subConfig)
      ).to.be.rejectedWith("Cannot call to stake with no value given");
      await expect(
        actions.stake("-1", lockUntil, staker, subConfig)
      ).to.be.rejectedWith("Cannot call to stake with no value given");
    });
  });
  describe("unstake", () => {
    it("Fails when calling to unstake with 0 amount", async () => {
      await expect(
        actions.unstake("0", "0", staker, subConfig)
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
        actions.unstake("0", "1", staker, subConfig)
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
        actions.unstake("0", "10", staker, subConfig)
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
        actions.unstake("0", "1", staker, subConfig)
      ).to.be.rejectedWith(
        "You are not able to unstake when your deposit is still locked"
      );
    });
  });
  describe("updateStakeLock", () => {
    it("Fails when trying to stake nothing or a negative value", async () => {
      let lockUntil = ethers.BigNumber.from("0");
      await expect(
        actions.updateStakeLock("0", lockUntil, staker, subConfig)
      ).to.be.rejectedWith(
        "Cannot add zero or negative time to your locking period"
      );
      lockUntil = ethers.BigNumber.from("-1");
      await expect(
        actions.updateStakeLock("0", lockUntil, staker, subConfig)
      ).to.be.rejectedWith(
        "Cannot add zero or negative time to your locking period"
      );
    });
  });
});

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

const defaultProvider = ethers.getDefaultProvider();

describe("Test Custom SDK Logic", async () => {
  const config: Config = {
    provider: ethers.providers.getDefaultProvider(),
    factoryAddress: "0x47946797E05A34B47ffE7151D0Fbc15E8297650E",
    lpTokenPoolAddress: "0x9CF0DaD38E4182d944a1A4463c56CFD1e6fa8fE7",
    wildPoolAddress: "0x4E226a8BbECAa435d2c77D3E4a096F87322Ef1Ae",
  };

  // Dummy address pulled from Ethers VoidSigner docs
  const staker = new ethers.VoidSigner("0x8ba1f109551bD432803012645Ac136ddd64DBA72")
  const subConfig: SubConfig = {
    address: config.wildPoolAddress,
    provider: defaultProvider,
  };

<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
  // calculateUvl
  describe("calculateUserValueLocked", async () => {
=======
>>>>>>> Stashed changes
  describe("calculatePoolApr", async () => {
    it("runs", async () => {

      // Mock Factory
      const mockPoolFactory1 = {
        getRewardTokensPerBlock: () => { return ethers.utils.parseUnits("1000", 18); },
        totalWeight: () => { return ethers.BigNumber.from("1000"); },
        getPoolData: () => {
          return ["0x0", "0x1", ethers.BigNumber.from("200"), false]
        }
      }
      const mockFactory1 = ImportMock.mockFunction(
        helpers,
        "getPoolFactory",
        mockPoolFactory1
      );

      // Mock Pool
      const mockCorePool = {
        poolTokenReserve: () => { return ethers.BigNumber.from("10000000") },
        factory: () => { return "0x0" },
        provider: config.provider
      }
      const mockPool = ImportMock.mockFunction(
        helpers,
        "getCorePool",
        mockCorePool
      )

      const wildApr = await actions.calculatePoolApr(subConfig);
      expect(wildApr).to.equal(47.5814)

      mockFactory1.restore();

      // Mock Factory Again
      const mockPoolFactory2 = {
        getRewardTokensPerBlock: () => { return ethers.utils.parseUnits("1000", 18); },
        totalWeight: () => { return ethers.BigNumber.from("1000"); },
        getPoolData: () => {
          return ["0x0", "0x1", ethers.BigNumber.from("800"), false]
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

      const lpTokenApr = await actions.calculatePoolApr(lpSubConfig);
      expect(lpTokenApr).to.equal(190.3256)
      mockFactory2.restore();
      mockPool.restore();
    })
  });
<<<<<<< Updated upstream
  describe("calculateUserValueStaked", async () => {
=======
  describe("calculatePoolTotalValueLocked", async () => {
    it("runs", async () => {
      const res = await actions.calculatePoolTotalValueLocked(false, subConfig);
    });
  })
  describe("calculateUserValueStaked", async () => {
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    it("Fails when a user provides an invalid address", async () => {
      await expect(
        actions.calculateUserValueStaked("0x0", subConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
    });
    it("Returns nothing when the user has no deposits", async () => {
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
        subConfig
      );
      expect(deposits.userValueLocked.toNumber()).to.equal(0);
      mock.restore();
    });
    it("Doesn't add deposits that are locked", async () => {
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
        subConfig
      );
      expect(deposits.userValueLocked.toNumber()).to.equal(100);
      expect(deposits.userValueUnlocked.toNumber()).to.equal(0);
      mock.restore();
    });
    it("Adds deposits that are unlocked", async () => {
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
        subConfig
      );
      expect(deposits.userValueLocked.toNumber()).to.equal(0);
      expect(deposits.userValueUnlocked.toNumber()).to.equal(100);
      mock.restore();
    });
  });
  describe("changePoolWeight", async () => {
    it("Fails when given an invalid pool address", async () => {
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
      mock.restore();
    });
  });
  describe("getAllDeposits", async () => {
    it("Returns an empty array when no deposits are found", async () => {
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
      mock.restore();
    });
    it("Returns a populated array when there are deposits", async () => {
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
      mock.restore();
    });
  });
  describe("pendingYieldRewards", async () => {
    it("Fails when given an invalid address", async () => {
      await expect(
        actions.pendingYieldRewards("0x0", subConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
      await expect(
        actions.pendingYieldRewards("", subConfig)
      ).to.be.rejectedWith("Must provide a valid user address");
    });
  });
  describe("processRewards", async () => {
    it("Fails when there are no rewards to process", async () => {
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
      mock.restore();
    });
  });
  describe("stake", async () => {
    it("runs", async () => {
      // whole thing
      const config: Config = {
        provider: new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"]),
        wildPoolAddress: "0x4E226a8BbECAa435d2c77D3E4a096F87322Ef1Ae",
        lpTokenPoolAddress: "0x9CF0DaD38E4182d944a1A4463c56CFD1e6fa8fE7",
        factoryAddress: "0x47946797E05A34B47ffE7151D0Fbc15E8297650E"
      }
      const privateKey = process.env["WALLET_PRIVATE_KEY"];
      if (!privateKey) throw Error("No private key found, cannot create a signing wallet");

      const staker = new ethers.Wallet(privateKey, config.provider);

      const instance = createInstance(config);

      const tx = await instance.wildPool.stake("150", ethers.BigNumber.from("0"), staker);
      console.log(tx);
      const receipt = await tx.wait(2);
      console.log(receipt);
    });
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
  describe("unstake", async () => {
    it("Fails when calling to unstake with 0 amount", async () => {
      await expect(
        actions.unstake("0", "0", staker, subConfig)
      ).to.be.rejectedWith("You can only unstake a non-zero amount of tokens");
    });
    it("Fails when calling to unstake with no deposits", async () => {
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
      mock.restore();
    });
    it("Fails when you try to unstake more than you have staked", async () => {
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
      mock.restore();
    });
    it("Fails when you try to remove a deposit that is still locked", async () => {
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
      mock.restore();
    });
  });
  describe("updateStakeLock", async () => {
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

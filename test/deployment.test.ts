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

describe("Test Custom SDK Logic", async () => {
  const config: Config = {
    provider: new ethers.providers.JsonRpcProvider(process.env["INFURA_URL"]),
    factoryAddress: "0xf06C810c5ee8908A02dc5fE4D82D0578cA53a888",
    lpTokenPoolAddress: "0x69A38AF3D05C8E7A07Ddbe27Dd84Bd7DfCDb0BE6",
    wildPoolAddress: "0x9495B4e974E0e5b2865762d1fd5640E7A6c7Fa37",
  };

  const sdkInstance = createInstance(config);

  describe("Test actions.unstake", async () => {
    const mnemonic = process.env["TESTNET_MNEMONIC"];
    if (!mnemonic) throw Error();

    const staker = ethers.Wallet.fromMnemonic(mnemonic);
    const subConfig: SubConfig = {
      address: config.wildPoolAddress,
      provider: config.provider,
    };
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
              return "asdasda";
            },
          };
        },
        getDepositsLength: () => {
          return ethers.BigNumber.from("1");
        },
        getDeposit: () => {
          return {
            tokenAmount: ethers.BigNumber.from("5"),
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
        actions.unstake("0", "5", staker, subConfig)
      ).to.be.rejectedWith(
        "You cannot unstake more than the original stake amount"
      );
      mock.restore();
    });
  });
});

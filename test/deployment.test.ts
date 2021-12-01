import * as chai from "chai";
import * as hre from "hardhat";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import { Config, Instance } from "../src/types";
import { createInstance } from "../src";
import { expect } from "chai";

chai.use(solidity);

describe("Test using the Kovan Deployment Addresses", async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env["INFURA_URL"]
  );
  const factoryAddress = "0xdF14A0FDd9ec6BdB5736A5938A35436D9F68E051";
  const lpConfig: Config = {
    provider: provider,
    poolAddress: "0xD364C50c33902110230255FE1D730D84FA23e48e",
    factoryAddress: factoryAddress,
  };
  const wildConfig: Config = {
    provider: provider,
    poolAddress: "0x3C0ACb650e536C0003740D6d5d4D3620aC367A43",
    factoryAddress: factoryAddress,
  };
  const lpInstance: Instance = createInstance(lpConfig);
  const wildInstance: Instance = createInstance(wildConfig);

  it("Can run anything", async () => {
    // Kovan WILD Address
    const poolAddress = await wildInstance.getPoolAddress(
      "0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F"
    );
    expect(poolAddress).to.equal(wildConfig.poolAddress);
  });
});

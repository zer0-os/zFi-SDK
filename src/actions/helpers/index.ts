import CoinGecko from "coingecko-api";
import * as ethers from "ethers";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];

export const networkAddresses = {
  mainnet: {
    WILD: "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34",
    wETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    wildStakingPool: "0x3aC551725ac98C5DCdeA197cEaaE7cDb8a71a2B4",
    lpTokenStakingPool: "0x9E87a268D42B0Aba399C121428fcE2c626Ea01FF",
    factory: "0xF133faFd49f4671ac63EE3a3aE7E7C4C9B84cE4a",
    UniswapPool: "0xcaa004418eb42cdf00cb057b7c9e28f0ffd840a5",
  },
  kovan: {
    WILD: "0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F",
    wETH: "0x61659a8093FeAe3be9E1fb1B410e8E3C6de38894", // Mock wETH
    wildStakingPool: "0x4E226a8BbECAa435d2c77D3E4a096F87322Ef1Ae",
    lpTokenStakingPool: "0x9CF0DaD38E4182d944a1A4463c56CFD1e6fa8fE7",
    factory: "0x47946797E05A34B47ffE7151D0Fbc15E8297650E",
    UniswapPool: "0xD364C50c33902110230255FE1D730D84FA23e48e",
  },
};

export const getWildToken = async (
  network: string,
  provider: ethers.providers.Provider
): Promise<ethers.Contract> => {
  const address = network === "mainnet" ?
    networkAddresses.mainnet.WILD :
    networkAddresses.kovan.WILD;

  const wildToken = new ethers.Contract(
    address,
    erc20Abi,
    provider
  );

  return wildToken;
}

export const getWethToken = async (
  network: string,
  provider: ethers.providers.Provider
): Promise<ethers.Contract> => {
  const address = network === "mainnet" ?
    networkAddresses.mainnet.wETH :
    networkAddresses.kovan.wETH;

  const wEthToken = new ethers.Contract(
    address,
    erc20Abi,
    provider
  );

  return wEthToken;
}

export const getLpToken = async (
  network: string,
  provider: ethers.providers.Provider
): Promise<ethers.Contract> => {
  const address = network === "mainnet" ?
    networkAddresses.mainnet.UniswapPool :
    networkAddresses.kovan.UniswapPool;

  const lpToken = new ethers.Contract(
    address,
    erc20Abi,
    provider
  );

  return lpToken;
}

export const wildPriceUsd = async () => {
  const client = new CoinGecko();
  const wildData = await client.coins.fetch("wilder-world", {
    market_data: true,
  });
  const wildPriceUsd = wildData.data.market_data.current_price.usd;
  return wildPriceUsd;
}

export const ethPriceUsd = async () => {
  const client = new CoinGecko();
  const ethData = await client.coins.fetch("ethereum", {
    market_data: true
  });
  const ethPriceUsd = ethData.data.market_data.current_price.usd;
  return ethPriceUsd;
}

export const lpTokenPriceUsd = async (network: string, provider: ethers.providers.Provider) => {
  const uniswapPool = network === "mainnet" ? networkAddresses.mainnet.UniswapPool : networkAddresses.kovan.UniswapPool;

  const wildPrice = await wildPriceUsd();
  const ethPrice = await ethPriceUsd();
  const lpToken = await getLpToken(network, provider);

  const wildToken = await getWildToken(network, provider);
  const wethToken = await getWethToken(network, provider);

  const wildBalance = await wildToken.balanceOf(uniswapPool);
  const wethBalance = await wethToken.balanceOf(uniswapPool);

  const lpTokenTotalSupply = await lpToken.totalSupply();

  const lpWildTvl = wildPrice * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl = ethPrice * Number(ethers.utils.formatEther(wethBalance));

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice =
    lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  return lpTokenPrice;
}
import CoinGecko from "coingecko-api";
import * as ethers from "ethers";
import { NetworkChainId } from "../../types";

const erc20Abi = [
  "function balanceOf(address _owner) public view returns (uint256)",
  "function totalSupply() public view returns (uint256)",
];

export const networkAddresses = {
  1: { // mainnet
    WILD: "0x2a3bFF78B79A009976EeA096a51A948a3dC00e34",
    wETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    wildStakingPool: "0x3aC551725ac98C5DCdeA197cEaaE7cDb8a71a2B4",
    lpTokenStakingPool: "0x9E87a268D42B0Aba399C121428fcE2c626Ea01FF",
    factory: "0xF133faFd49f4671ac63EE3a3aE7E7C4C9B84cE4a",
    UniswapPoolToken: "0xcaa004418eb42cdf00cb057b7c9e28f0ffd840a5",
  },
  42: { // kovan
    WILD: "0x50A0A3E9873D7e7d306299a75Dc05bd3Ab2d251F",
    wETH: "0x61659a8093FeAe3be9E1fb1B410e8E3C6de38894", // Mock wETH
    wildStakingPool: "0x4E226a8BbECAa435d2c77D3E4a096F87322Ef1Ae",
    lpTokenStakingPool: "0x9CF0DaD38E4182d944a1A4463c56CFD1e6fa8fE7",
    factory: "0x47946797E05A34B47ffE7151D0Fbc15E8297650E",
    UniswapPoolToken: "0xD364C50c33902110230255FE1D730D84FA23e48e",
  },
  4: { // rinkeby
    WILD: "0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79",
    wETH: "0x5bAbCA2Af93A9887C86161083b8A90160DA068f2", // Actually mLOOT
    wildStakingPool: "0xE0Bb298Afc5dC12918d02732c824DA44e7D61E2a",
    lpTokenStakingPool: "0xe7BEeedAf11eE695C4aE64A01b24F3F7eA294aB6",
    factory: "0xb1d051095B6b2f6C93198Cbaa9bb7cB2d607215C",
    UniswapPoolToken: "0x0A0f5AD73077108cFD806a0de77333AdA928cC99",
  },
  5: { // goerli
    WILD: "0x0e46c45f8aca3f89Ad06F4a20E2BED1A12e4658C",
    wETH: "0x196bc789E03761904E3d7266fa57f2001592D25A", // Actually mLOOT
    wildStakingPool: "0x376030f58c76ECC288a4fce8F88273905544bC07",
    lpTokenStakingPool: "0xCa0F071fcf5b36436F75E422b5Bd23666015b9f9",
    factory: "0xAeEaC5F790dD98FD7166bBD50d9938Bf542AFeEf",
    UniswapPoolToken: "0x196bc789E03761904E3d7266fa57f2001592D25A",
  }
};

export const getWildToken = async (
  provider: ethers.providers.Provider,
): Promise<ethers.Contract> => {
  const network = await provider.getNetwork();
  const chainId: NetworkChainId = network.chainId;

  const address = networkAddresses[chainId].WILD
  const wildToken = new ethers.Contract(address, erc20Abi, provider);

  return wildToken;
};

export const getWethToken = async (
  provider: ethers.providers.Provider
): Promise<ethers.Contract> => {
  const network = await provider.getNetwork();
  const chainId: NetworkChainId = network.chainId;
  const address = networkAddresses[chainId].wETH

  const wEthToken = new ethers.Contract(address, erc20Abi, provider);

  return wEthToken;
};

export const getLpToken = async (
  provider: ethers.providers.Provider
): Promise<ethers.Contract> => {
  const network = await provider.getNetwork();
  const chainId: NetworkChainId = network.chainId;
  const address = networkAddresses[chainId].UniswapPoolToken;

  const lpToken = new ethers.Contract(address, erc20Abi, provider);
  return lpToken;
};

export const wildPriceUsd = async () => {
  const client = new CoinGecko();
  const wildData = await client.coins.fetch("wilder-world", {
    market_data: true,
  });
  const wildPriceUsd = wildData.data.market_data.current_price.usd;
  return wildPriceUsd;
};

export const ethPriceUsd = async () => {
  const client = new CoinGecko();
  const ethData = await client.coins.fetch("ethereum", {
    market_data: true,
  });
  const ethPriceUsd = ethData.data.market_data.current_price.usd;
  return ethPriceUsd;
};

export const lpTokenPriceUsd = async (provider: ethers.providers.Provider) => {
  const network = await provider.getNetwork();
  const chainId: NetworkChainId = network.chainId;
  const uniswapPoolAddress = networkAddresses[chainId].UniswapPoolToken;

  let tokenPromises = [
    getLpToken(provider),
    getWildToken(provider),
    getWethToken(provider),
  ];

  const [lpToken, wildToken, wethToken] = await Promise.all(tokenPromises);

  // Must separate promises of different implicit types
  let pricePromises = [wildPriceUsd(), ethPriceUsd()];

  const [wildPrice, ethPrice] = await Promise.all(pricePromises);

  // Because we use Function Fragments internally, these return `any` types if nt
  // explicitly defined
  let balancePromises = [
    wildToken.balanceOf(uniswapPoolAddress) as ethers.BigNumber,
    wethToken.balanceOf(uniswapPoolAddress) as ethers.BigNumber,
    lpToken.totalSupply() as ethers.BigNumber,
  ];

  const [wildBalance, wethBalance, lpTokenTotalSupply] = await Promise.all(
    balancePromises
  );

  const lpWildTvl =
    Number(wildPrice) * Number(ethers.utils.formatEther(wildBalance));
  const lpWEthTvl =
    Number(ethPrice) * Number(ethers.utils.formatEther(wethBalance));

  // TVL of Uniswap pool
  const lpTvl = lpWildTvl + lpWEthTvl;

  const lpTokenPrice =
    lpTvl / Number(ethers.utils.formatEther(lpTokenTotalSupply));

  return lpTokenPrice;
};

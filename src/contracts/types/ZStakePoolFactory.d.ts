/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ZStakePoolFactoryInterface extends ethers.utils.Interface {
  functions: {
    "blockNumber()": FunctionFragment;
    "changePoolWeight(address,uint32)": FunctionFragment;
    "changeRewardTokensPerBlock(uint256)": FunctionFragment;
    "getPoolAddress(address)": FunctionFragment;
    "getPoolData(address)": FunctionFragment;
    "getRewardTokensPerBlock()": FunctionFragment;
    "initialize(address,address,uint192)": FunctionFragment;
    "owner()": FunctionFragment;
    "poolExists(address)": FunctionFragment;
    "pools(address)": FunctionFragment;
    "registerPool(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardToken()": FunctionFragment;
    "rewardVault()": FunctionFragment;
    "totalWeight()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "transferRewardYield(address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "blockNumber",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "changePoolWeight",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "changeRewardTokensPerBlock",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolAddress",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getPoolData", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getRewardTokensPerBlock",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "poolExists", values: [string]): string;
  encodeFunctionData(functionFragment: "pools", values: [string]): string;
  encodeFunctionData(
    functionFragment: "registerPool",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardVault",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalWeight",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferRewardYield",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "blockNumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changePoolWeight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeRewardTokensPerBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRewardTokensPerBlock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolExists", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalWeight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferRewardYield",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "PoolRegistered(address,address,address,uint64,bool)": EventFragment;
    "WeightUpdated(address,address,uint32)": EventFragment;
    "WildRatioUpdated(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolRegistered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WeightUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WildRatioUpdated"): EventFragment;
}

export class ZStakePoolFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ZStakePoolFactoryInterface;

  functions: {
    blockNumber(overrides?: CallOverrides): Promise<[BigNumber]>;

    changePoolWeight(
      poolAddr: string,
      weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeRewardTokensPerBlock(
      perBlock: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getPoolAddress(
      poolToken: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPoolData(
      _poolToken: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, string, number, boolean] & {
          poolToken: string;
          poolAddress: string;
          weight: number;
          isFlashPool: boolean;
        }
      ]
    >;

    getRewardTokensPerBlock(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      _rewardToken: string,
      _rewardsVault: string,
      _rewardTokensPerBlock: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    poolExists(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    pools(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    registerPool(
      poolAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    rewardVault(overrides?: CallOverrides): Promise<[string]>;

    totalWeight(overrides?: CallOverrides): Promise<[number]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferRewardYield(
      _to: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

  changePoolWeight(
    poolAddr: string,
    weight: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeRewardTokensPerBlock(
    perBlock: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getPoolAddress(poolToken: string, overrides?: CallOverrides): Promise<string>;

  getPoolData(
    _poolToken: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, number, boolean] & {
      poolToken: string;
      poolAddress: string;
      weight: number;
      isFlashPool: boolean;
    }
  >;

  getRewardTokensPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    _rewardToken: string,
    _rewardsVault: string,
    _rewardTokensPerBlock: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  poolExists(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  pools(arg0: string, overrides?: CallOverrides): Promise<string>;

  registerPool(
    poolAddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  rewardVault(overrides?: CallOverrides): Promise<string>;

  totalWeight(overrides?: CallOverrides): Promise<number>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferRewardYield(
    _to: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

    changePoolWeight(
      poolAddr: string,
      weight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    changeRewardTokensPerBlock(
      perBlock: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getPoolAddress(
      poolToken: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getPoolData(
      _poolToken: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, number, boolean] & {
        poolToken: string;
        poolAddress: string;
        weight: number;
        isFlashPool: boolean;
      }
    >;

    getRewardTokensPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _rewardToken: string,
      _rewardsVault: string,
      _rewardTokensPerBlock: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    poolExists(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    pools(arg0: string, overrides?: CallOverrides): Promise<string>;

    registerPool(poolAddr: string, overrides?: CallOverrides): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    rewardVault(overrides?: CallOverrides): Promise<string>;

    totalWeight(overrides?: CallOverrides): Promise<number>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferRewardYield(
      _to: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    PoolRegistered(
      _by?: string | null,
      poolToken?: string | null,
      poolAddress?: string | null,
      weight?: null,
      isFlashPool?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber, boolean],
      {
        _by: string;
        poolToken: string;
        poolAddress: string;
        weight: BigNumber;
        isFlashPool: boolean;
      }
    >;

    WeightUpdated(
      _by?: string | null,
      poolAddress?: string | null,
      weight?: null
    ): TypedEventFilter<
      [string, string, number],
      { _by: string; poolAddress: string; weight: number }
    >;

    WildRatioUpdated(
      _by?: string | null,
      newIlvPerBlock?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { _by: string; newIlvPerBlock: BigNumber }
    >;
  };

  estimateGas: {
    blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

    changePoolWeight(
      poolAddr: string,
      weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeRewardTokensPerBlock(
      perBlock: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getPoolAddress(
      poolToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPoolData(
      _poolToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRewardTokensPerBlock(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _rewardToken: string,
      _rewardsVault: string,
      _rewardTokensPerBlock: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    poolExists(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    pools(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    registerPool(
      poolAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    rewardVault(overrides?: CallOverrides): Promise<BigNumber>;

    totalWeight(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferRewardYield(
      _to: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    blockNumber(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    changePoolWeight(
      poolAddr: string,
      weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeRewardTokensPerBlock(
      perBlock: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getPoolAddress(
      poolToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPoolData(
      _poolToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRewardTokensPerBlock(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _rewardToken: string,
      _rewardsVault: string,
      _rewardTokensPerBlock: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolExists(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pools(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerPool(
      poolAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    rewardVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalWeight(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferRewardYield(
      _to: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}

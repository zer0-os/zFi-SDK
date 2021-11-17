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

interface ZStakePoolBaseInterface extends ethers.utils.Interface {
  functions: {
    "balanceOf(address)": FunctionFragment;
    "blockNumber()": FunctionFragment;
    "factory()": FunctionFragment;
    "getDeposit(address,uint256)": FunctionFragment;
    "getDepositsLength(address)": FunctionFragment;
    "isFlashPool()": FunctionFragment;
    "lastYieldDistribution()": FunctionFragment;
    "now256()": FunctionFragment;
    "pendingYieldRewards(address)": FunctionFragment;
    "poolToken()": FunctionFragment;
    "processRewards()": FunctionFragment;
    "rewardToWeight(uint256,uint256)": FunctionFragment;
    "setWeight(uint32)": FunctionFragment;
    "stake(uint256,uint64)": FunctionFragment;
    "sync()": FunctionFragment;
    "testFunc()": FunctionFragment;
    "unstake(uint256,uint256)": FunctionFragment;
    "updateStakeLock(uint256,uint64)": FunctionFragment;
    "users(address)": FunctionFragment;
    "usersLockingWeight()": FunctionFragment;
    "weight()": FunctionFragment;
    "weightToReward(uint256,uint256)": FunctionFragment;
    "wild()": FunctionFragment;
    "yieldRewardsPerWeight()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "blockNumber",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getDeposit",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDepositsLength",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isFlashPool",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "lastYieldDistribution",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "now256", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingYieldRewards",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "poolToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "processRewards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToWeight",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setWeight",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "stake",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "sync", values?: undefined): string;
  encodeFunctionData(functionFragment: "testFunc", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "unstake",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateStakeLock",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "users", values: [string]): string;
  encodeFunctionData(
    functionFragment: "usersLockingWeight",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "weight", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "weightToReward",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "wild", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "yieldRewardsPerWeight",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "blockNumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDeposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDepositsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isFlashPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastYieldDistribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "now256", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingYieldRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poolToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "processRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToWeight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setWeight", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stake", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sync", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "testFunc", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unstake", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "updateStakeLock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "users", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "usersLockingWeight",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "weight", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "weightToReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "wild", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "yieldRewardsPerWeight",
    data: BytesLike
  ): Result;

  events: {
    "PoolWeightUpdated(address,uint32,uint32)": EventFragment;
    "StakeLockUpdated(address,uint256,uint64,uint64)": EventFragment;
    "Staked(address,address,uint256)": EventFragment;
    "Synchronized(address,uint256,uint64)": EventFragment;
    "Unstaked(address,address,uint256)": EventFragment;
    "YieldClaimed(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PoolWeightUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StakeLockUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Staked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Synchronized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unstaked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "YieldClaimed"): EventFragment;
}

export class ZStakePoolBase extends BaseContract {
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

  interface: ZStakePoolBaseInterface;

  functions: {
    balanceOf(_user: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    blockNumber(overrides?: CallOverrides): Promise<[BigNumber]>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    getDeposit(
      _user: string,
      _depositId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
          tokenAmount: BigNumber;
          weight: BigNumber;
          lockedFrom: BigNumber;
          lockedUntil: BigNumber;
          isYield: boolean;
        }
      ]
    >;

    getDepositsLength(
      _user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isFlashPool(overrides?: CallOverrides): Promise<[boolean]>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<[BigNumber]>;

    now256(overrides?: CallOverrides): Promise<[BigNumber]>;

    pendingYieldRewards(
      _staker: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    poolToken(overrides?: CallOverrides): Promise<[string]>;

    processRewards(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardToWeight(
      reward: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setWeight(
      _weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sync(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    testFunc(overrides?: CallOverrides): Promise<[string]>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    users(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        tokenAmount: BigNumber;
        totalWeight: BigNumber;
        subYieldRewards: BigNumber;
      }
    >;

    usersLockingWeight(overrides?: CallOverrides): Promise<[BigNumber]>;

    weight(overrides?: CallOverrides): Promise<[number]>;

    weightToReward(
      _weight: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    wild(overrides?: CallOverrides): Promise<[string]>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  balanceOf(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

  blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

  factory(overrides?: CallOverrides): Promise<string>;

  getDeposit(
    _user: string,
    _depositId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
      tokenAmount: BigNumber;
      weight: BigNumber;
      lockedFrom: BigNumber;
      lockedUntil: BigNumber;
      isYield: boolean;
    }
  >;

  getDepositsLength(
    _user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isFlashPool(overrides?: CallOverrides): Promise<boolean>;

  lastYieldDistribution(overrides?: CallOverrides): Promise<BigNumber>;

  now256(overrides?: CallOverrides): Promise<BigNumber>;

  pendingYieldRewards(
    _staker: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  poolToken(overrides?: CallOverrides): Promise<string>;

  processRewards(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardToWeight(
    reward: BigNumberish,
    rewardPerWeight: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setWeight(
    _weight: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stake(
    _amount: BigNumberish,
    _lockUntil: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sync(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unstake(
    _depositId: BigNumberish,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  updateStakeLock(
    depositId: BigNumberish,
    lockedUntil: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  users(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber] & {
      tokenAmount: BigNumber;
      totalWeight: BigNumber;
      subYieldRewards: BigNumber;
    }
  >;

  usersLockingWeight(overrides?: CallOverrides): Promise<BigNumber>;

  weight(overrides?: CallOverrides): Promise<number>;

  weightToReward(
    _weight: BigNumberish,
    rewardPerWeight: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  wild(overrides?: CallOverrides): Promise<string>;

  yieldRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    balanceOf(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<string>;

    getDeposit(
      _user: string,
      _depositId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, boolean] & {
        tokenAmount: BigNumber;
        weight: BigNumber;
        lockedFrom: BigNumber;
        lockedUntil: BigNumber;
        isYield: boolean;
      }
    >;

    getDepositsLength(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isFlashPool(overrides?: CallOverrides): Promise<boolean>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<BigNumber>;

    now256(overrides?: CallOverrides): Promise<BigNumber>;

    pendingYieldRewards(
      _staker: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolToken(overrides?: CallOverrides): Promise<string>;

    processRewards(overrides?: CallOverrides): Promise<void>;

    rewardToWeight(
      reward: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setWeight(_weight: BigNumberish, overrides?: CallOverrides): Promise<void>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    sync(overrides?: CallOverrides): Promise<void>;

    testFunc(overrides?: CallOverrides): Promise<string>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    users(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        tokenAmount: BigNumber;
        totalWeight: BigNumber;
        subYieldRewards: BigNumber;
      }
    >;

    usersLockingWeight(overrides?: CallOverrides): Promise<BigNumber>;

    weight(overrides?: CallOverrides): Promise<number>;

    weightToReward(
      _weight: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    wild(overrides?: CallOverrides): Promise<string>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    PoolWeightUpdated(
      _by?: string | null,
      _fromVal?: null,
      _toVal?: null
    ): TypedEventFilter<
      [string, number, number],
      { _by: string; _fromVal: number; _toVal: number }
    >;

    StakeLockUpdated(
      _by?: string | null,
      depositId?: null,
      lockedFrom?: null,
      lockedUntil?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber, BigNumber],
      {
        _by: string;
        depositId: BigNumber;
        lockedFrom: BigNumber;
        lockedUntil: BigNumber;
      }
    >;

    Staked(
      _by?: string | null,
      _from?: string | null,
      amount?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _by: string; _from: string; amount: BigNumber }
    >;

    Synchronized(
      _by?: string | null,
      yieldRewardsPerWeight?: null,
      lastYieldDistribution?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      {
        _by: string;
        yieldRewardsPerWeight: BigNumber;
        lastYieldDistribution: BigNumber;
      }
    >;

    Unstaked(
      _by?: string | null,
      _to?: string | null,
      amount?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _by: string; _to: string; amount: BigNumber }
    >;

    YieldClaimed(
      _by?: string | null,
      _to?: string | null,
      amount?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { _by: string; _to: string; amount: BigNumber }
    >;
  };

  estimateGas: {
    balanceOf(_user: string, overrides?: CallOverrides): Promise<BigNumber>;

    blockNumber(overrides?: CallOverrides): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    getDeposit(
      _user: string,
      _depositId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDepositsLength(
      _user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isFlashPool(overrides?: CallOverrides): Promise<BigNumber>;

    lastYieldDistribution(overrides?: CallOverrides): Promise<BigNumber>;

    now256(overrides?: CallOverrides): Promise<BigNumber>;

    pendingYieldRewards(
      _staker: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    poolToken(overrides?: CallOverrides): Promise<BigNumber>;

    processRewards(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardToWeight(
      reward: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setWeight(
      _weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sync(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    testFunc(overrides?: CallOverrides): Promise<BigNumber>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    users(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    usersLockingWeight(overrides?: CallOverrides): Promise<BigNumber>;

    weight(overrides?: CallOverrides): Promise<BigNumber>;

    weightToReward(
      _weight: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    wild(overrides?: CallOverrides): Promise<BigNumber>;

    yieldRewardsPerWeight(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    balanceOf(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    blockNumber(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDeposit(
      _user: string,
      _depositId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDepositsLength(
      _user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isFlashPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastYieldDistribution(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    now256(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingYieldRewards(
      _staker: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    processRewards(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardToWeight(
      reward: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setWeight(
      _weight: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stake(
      _amount: BigNumberish,
      _lockUntil: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sync(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    testFunc(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unstake(
      _depositId: BigNumberish,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    updateStakeLock(
      depositId: BigNumberish,
      lockedUntil: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    users(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    usersLockingWeight(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    weight(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    weightToReward(
      _weight: BigNumberish,
      rewardPerWeight: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    wild(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    yieldRewardsPerWeight(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

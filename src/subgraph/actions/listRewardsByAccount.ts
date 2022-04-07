import { ApolloClient } from "@apollo/client/core";
import { Reward } from "../../types";
import * as queries from "../queries";
import { RewardsDto } from "../types";

export const listRewardsByAccount = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string,
  accountAddress: string,
): Promise<Reward[]> => {
  const collection: Reward[] = [];

  const queryResult = await apolloClient.query<RewardsDto>({
    query: queries.getAccountRewards,
    variables: {
      poolAddress: poolAddress.toLowerCase(),
      accountAddress: accountAddress.toLowerCase()
    },
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  const dto: RewardsDto = queryResult.data;
  dto.rewards.map((r: Reward) => {
    collection.push({
      for: r.for,
      amount: r.amount,
      pool: r.pool,
      timestamp: r.timestamp,
    } as Reward);
  });

  return collection;
};

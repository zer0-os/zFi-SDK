import { ApolloClient } from "@apollo/client/core";
import { Reward } from "../../types";
import * as queries from "../queries";
import { RewardDto, RewardsDto } from "../types";

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
  dto.rewards.map((r: RewardDto) => {
    collection.push({
      for: r.for.id,
      tokenAmount: r.tokenAmount,
      pool: r.pool.id,
      timestamp: r.timestamp,
    } as Reward);
  });

  return collection;
};

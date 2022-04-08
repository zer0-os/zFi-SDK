import { ApolloClient } from "@apollo/client/core";
import { Reward } from "../../types";
import * as queries from "../queries";
import { RewardDto, RewardsDto } from "../types";

export const listRewards = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string
): Promise<Reward[]> => {
  const collection: Reward[] = [];

  const queryResult = await apolloClient.query<RewardsDto>({
    query: queries.getPoolRewards,
    variables: {
      poolAddress: poolAddress.toLowerCase(),
    },
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  const dto: RewardsDto = queryResult.data;
  dto.rewards.map((r: RewardDto) => {
    const reward: Reward = {
      for: r.for.id,
      tokenAmount: r.tokenAmount,
      pool: r.pool.id,
      timestamp: r.timestamp,
    }
    collection.push(reward);
  });

  return collection;
};

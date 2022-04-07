import { ApolloClient } from "@apollo/client/core";
import { Reward } from "../../types";
import * as queries from "../queries";

export const listRewards = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string
): Promise<Reward[]> => {
  const collection: Reward[] = [];

  const queryResult = await apolloClient.query<Reward[]>({
    query: queries.getPoolRewards,
    variables: {
      poolAddress: poolAddress,
    },
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  queryResult.data.map((e) => {
    collection.push({
      for: e.for,
      amount: e.amount,
      pool: e.pool,
      timestamp: e.timestamp,
    } as Reward);
  });

  return collection;
};

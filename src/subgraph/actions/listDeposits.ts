import { ApolloClient } from "@apollo/client/core";
import { Deposit } from "../../types";
import * as queries from "../queries";

export const listDeposits = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string
): Promise<Deposit[]> => {
  const collection: Deposit[] = [];

  const queryResult = await apolloClient.query<Deposit[]>({
    query: queries.getPoolDeposits,
    variables: {
      poolAddress: poolAddress
    }
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  queryResult.data.map((e) => {
    collection.push({
      by: e.by,
      depositId: e.depositId,
      amount: e.amount,
      lockedFrom: e.lockedFrom,
      lockedUntil: e.lockedUntil,
      pool: e.pool,
      timestamp: e.timestamp,
    } as Deposit);
  });

  return collection;
};

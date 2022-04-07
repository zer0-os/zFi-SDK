import { ApolloClient } from "@apollo/client/core";
import { Deposit } from "../../types";
import * as queries from "../queries";

export const listDepositsByAccount = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string,
  accountAddress: string
): Promise<Deposit[]> => {
  const collection: Deposit[] = [];

  const queryResult = await apolloClient.query<Deposit[]>({
    query: queries.getAccountDeposits,
    variables: {
      poolAddress: poolAddress,
      accountAddress: accountAddress
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

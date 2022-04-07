import { ApolloClient } from "@apollo/client/core";
import { Deposit } from "../../types";
import * as queries from "../queries";
import { DepositsDto } from "../types";


export const listDepositsByAccount = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string,
  accountAddress: string
): Promise<Deposit[]> => {
  const collection: Deposit[] = [];

  const queryResult = await apolloClient.query<DepositsDto>({
    query: queries.getAccountDeposits,
    variables: {
      poolAddress: poolAddress.toLowerCase(),
      accountAddress: accountAddress.toLowerCase()
    }
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  const dto: DepositsDto = queryResult.data;
  dto.deposits.map((d: Deposit) => {
    collection.push({
      by: d.by,
      depositId: d.depositId,
      amount: d.amount,
      lockedFrom: d.lockedFrom,
      lockedUntil: d.lockedUntil,
      pool: d.pool,
      timestamp: d.timestamp,
    } as Deposit);
  });

  return collection;
};

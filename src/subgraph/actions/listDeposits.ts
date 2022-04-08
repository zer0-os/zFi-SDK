import { ApolloClient } from "@apollo/client/core";
import { Deposit } from "../../types";
import { DepositDto, DepositsDto } from "../types";

import * as queries from "../queries";

export const listDeposits = async <T>(
  apolloClient: ApolloClient<T>,
  poolAddress: string
): Promise<Deposit[]> => {
  const collection: Deposit[] = [];
  
  const queryResult = await apolloClient.query<DepositsDto>({
    query: queries.getPoolDeposits,
    variables: {
      poolAddress: poolAddress.toLowerCase()
    }
  });

  if (queryResult.error) {
    throw queryResult.error;
  }

  const dto: DepositsDto = queryResult.data;
  dto.deposits.map((d: DepositDto) => {
    collection.push({
      by: d.by.id,
      depositId: d.depositId,
      tokenAmount: d.tokenAmount,
      lockedFrom: d.lockedFrom,
      lockedUntil: d.lockedUntil,
      pool: d.pool.id,
      timestamp: d.timestamp,
    } as Deposit);
  });

  return collection;
};
import { ApolloClient } from "@apollo/client/core";
import { Deposit } from "../../types";
import * as queries from "../queries";
import { DepositDto, DepositsDto } from "../types";


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
  dto.deposits.map((d: DepositDto) => {
    const deposit: Deposit = {
      by: d.by.id,
      depositId: d.depositId,
      tokenAmount: d.tokenAmount,
      lockedFrom: d.lockedFrom,
      lockedUntil: d.lockedUntil,
      pool: d.pool.id,
      timestamp: d.timestamp
    }
    collection.push(deposit);
  });

  return collection;
};

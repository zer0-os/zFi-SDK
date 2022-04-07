import * as apollo from "@apollo/client/core";
import fetch from "cross-fetch";
import { Deposit } from "../types";

import * as actions from "./actions"
// import { TokenBuy, TokenSale, TokenSaleCollection } from "../types";
// import * as actions from "./actions";

export interface SubgraphClient {
  listDeposits: (poolAddress: string) => Promise<Deposit[]>;
}

const createApolloClient = (
  subgraphUri: string,
  isLpTokenPool: boolean
): apollo.ApolloClient<apollo.NormalizedCacheObject> => {
  const client = new apollo.ApolloClient({
    link: new apollo.HttpLink({ uri: subgraphUri, fetch }),
    cache: new apollo.InMemoryCache(),
  });

  return client;
};

export const createClient = (subgraphUri: string, isLpTokenPool: boolean): SubgraphClient => {
  const apolloClient = createApolloClient(subgraphUri, isLpTokenPool);

  const subgraphClient: SubgraphClient = {
    // Get all the deposits that exist in both pools
    listDeposits: (poolAddress: string) => {
      return actions.listDeposits(apolloClient, poolAddress);
    }
  };

  return subgraphClient;
};

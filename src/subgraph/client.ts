import * as apollo from "@apollo/client/core";
import fetch from "cross-fetch";
import { Deposit, Reward } from "../types";

import * as actions from "./actions"

export interface SubgraphClient {
  listDeposits: (poolAddress: string) => Promise<Deposit[]>;
  listDepositsByAccount: (poolAddress: string, accountAddress: string) => Promise<Deposit[]>;
  listRewards: (poolAddress: string) => Promise<Reward[]>;
  listRewardsByAccount: (poolAddress: string, accountAddress: string) => Promise<Reward[]>;
}

const createApolloClient = (
  subgraphUri: string,
): apollo.ApolloClient<apollo.NormalizedCacheObject> => {
  const client = new apollo.ApolloClient({
    link: new apollo.HttpLink({ uri: subgraphUri, fetch }),
    cache: new apollo.InMemoryCache(),
  });

  return client;
};

export const createClient = (subgraphUri: string): SubgraphClient => {
  const apolloClient = createApolloClient(subgraphUri);

  const subgraphClient: SubgraphClient = {
    // Get all the deposits that exist in both pools
    listDeposits: (poolAddress: string): Promise<Deposit[]> => {
      return actions.listDeposits(apolloClient, poolAddress);
    },
    listDepositsByAccount: (poolAddress: string, accountAddress: string): Promise<Deposit[]> => {
      return actions.listDepositsByAccount(apolloClient, poolAddress, accountAddress);
    },
    listRewards: (poolAddress: string): Promise<Reward[]> => {
      return actions.listRewards(apolloClient, poolAddress);
    },
    listRewardsByAccount: (poolAddress: string, accountAddress: string): Promise<Reward[]> => {
      return actions.listRewardsByAccount(apolloClient, poolAddress, accountAddress);
    },
  };

  return subgraphClient;
};

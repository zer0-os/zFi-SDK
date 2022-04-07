import { gql } from "@apollo/client/core";

// Get every deposit for a specific pool
export const getPoolDeposits = gql`
  query DepositsByPool($poolAddress: String!) {
    deposits(where: { pool: $poolAddress }) {
      id
      by {
        id
      }
      depositId
      amount
      lockedFrom
      lockedUntil
      pool {
        id
      }
      timestamp
    }
  }
`;

export const getAccountDeposits = gql`
  query DepositsByAccount($poolAddress: String, $accountAddress: String!) {
    deposits(where: { pool: $poolAddress, by: $accountAddress }) {
      id
      by {
        id
      }
      depositId
      amount
      pool {
        id
      }
      lockedFrom
      lockedUntil
      timestamp
    }
  }
`;

export const getPoolRewards = gql`
  query RewardsByPool($poolAddress: String!) {
    rewards(where: { pool: $poolAddress }) {
      id
      for {
        id
      }
      amount
      pool {
        id
      }
      timestamp
    }
  }
`;

export const getAccountRewards = gql`
  query ReawrdsByAccount($poolAddress: String!, $accountAddress: String!) {
    rewards(where: { pool: $poolAddress, for: $accountAddress }) {
      id
      for {
        id
      }
      amount
      pool {
        id
      }
      timestamp
    }
  }
`;
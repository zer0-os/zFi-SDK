import { gql } from "@apollo/client/core";

// Get every deposit
export const getAllDeposits = gql`
  query AllDeposits() {
    deposits {
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
  query DepositsByAccount($account: String!) {
    deposits(where: { by: $account }) {
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

// Rewards
export const getAllRewards = gql`
  query AllRewards() {
    rewards {
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
  query ReawrdsByAccount($account: String!) {
    rewards(where: { for: $account }) {
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
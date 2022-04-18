export interface Account {
  id: string;
}

export interface Pool {
  id: string;
}
export interface DepositDto {
  id: string;
  by: Account;
  depositId: string;
  tokenAmount: string;
  lockedFrom: string;
  lockedUntil: string;
  pool: Pool;
  timestamp: string;
}

export interface DepositsDto {
  deposits: DepositDto[];
}

export interface RewardDto {
  id: string;
  for: Account;
  tokenAmount: string;
  pool: Pool;
  timestamp: string;
}

export interface RewardsDto {
  rewards: RewardDto[];
}

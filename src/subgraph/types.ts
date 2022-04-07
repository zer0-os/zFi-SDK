export interface DepositDto {
  id: string;
  by: string;
  depositId: string;
  amount: string;
  lockedFrom: string;
  lockedUntil: string;
  pool: string;
  timestamp: string;
}

export interface DepositsDto {
  deposits: DepositDto[];
}

export interface RewardDto {
  id: string;
  for: string;
  amount: string;
  pool: string;
  timestamp: string;
}

export interface RewardsDto {
  rewards: RewardDto[];
}

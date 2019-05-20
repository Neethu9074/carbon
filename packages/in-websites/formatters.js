import { number } from 'in-services/formatters/number';

const affectedUsersInternal = v => {
  if (v < 1) {
    return 'N/A';
  }

  return number.compact(v);
};

export const affectedUsers = {
  compact: affectedUsersInternal,
  detailed: affectedUsersInternal
};

export const affectedUsersChart = {
  compact: number.compact,
  detailed: affectedUsersInternal
};

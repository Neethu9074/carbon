/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const affectedUsersInternal = v => {
  if (v < 1) {
    return t('in-websites:formattersNA');
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

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { micros, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.zIms.regionCount'),
    metric: 'Ims_health.region_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zIms.sharedTransactionQueue'),
    metric: 'Ims_health.shared_transaction_queue',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zIms.longestLock'),
    metric: 'Ims_health.longest_lock',
    formatter: micros.compact
  },
  {
    label: t('in-forge:plugins.zIms.highestR0Time'),
    metric: 'Ims_health.highest_r0_time',
    formatter: micros.compact
  }
];

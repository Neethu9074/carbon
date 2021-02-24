/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.activeMQArtemis.allQueuesMessagesCount'),
    metric: 'totalMessageCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.activeMQArtemis.addressMemoryUsage'),
    metric: 'addressMemoryPercentage',
    formatter: percentage.compact
  }
];

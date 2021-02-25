/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsMq.cpuCreditBalance'),
    metric: 'cpu_credit_balance',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.awsMq.currentConnectionsCount'),
    metric: 'current_connections_count',
    formatter: number.compact
  }
];

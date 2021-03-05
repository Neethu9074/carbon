/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'completedRebalancesTotal',
    label: t('in-forge:plugins.kafkaConnectWorker.completedRebalances'),
    formatter: number
  },
  {
    metric: 'rebalanceAvgTimeMs',
    label: t('in-forge:plugins.kafkaConnectWorker.rebalanceAverageTime'),
    formatter: millis
  },
  {
    metric: 'rebalancing',
    label: t('in-forge:plugins.kafkaConnectWorker.rebalancing'),
    formatter: number
  },
  {
    metric: 'timeSinceLastRebalanceMs',
    label: t('in-forge:plugins.kafkaConnectWorker.timeSinceLastRebalance'),
    formatter: millis
  }
];

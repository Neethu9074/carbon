/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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

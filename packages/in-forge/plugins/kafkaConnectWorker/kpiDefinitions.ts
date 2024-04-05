/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.kafkaConnectWorker.connectorCount'),
    metric: 'connectorCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.kafkaConnectWorker.connectorStartupFailure'),
    metric: 'connectorStartupFailurePercentage',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.kafkaConnectWorker.taskStartupFailure'),
    metric: 'taskStartupFailurePercentage',
    formatter: percentage.compact
  }
];

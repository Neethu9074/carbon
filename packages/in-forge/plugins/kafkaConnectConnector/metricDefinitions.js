/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'connectorDestroyedTaskCount',
    label: t('in-forge:plugins.kafkaConnectConnector.destroyedTasks'),
    formatter: number
  },
  {
    metric: 'connectorFailedTaskCount',
    label: t('in-forge:plugins.kafkaConnectConnector.failedTasks'),
    formatter: number
  },
  {
    metric: 'connectorPausedTaskCount',
    label: t('in-forge:plugins.kafkaConnectConnector.pausedTasks'),
    formatter: number
  },
  {
    metric: 'connectorRunningTaskCount',
    label: t('in-forge:plugins.kafkaConnectConnector.runningTasks'),
    formatter: number
  },
  {
    metric: 'connectorTotalTaskCount',
    label: t('in-forge:plugins.kafkaConnectConnector.totalTasks'),
    formatter: number
  },
  {
    metric: 'connectorUnassignedTaskCount',
    label: t('in-forge:plugins.kafkaConnectConnector.unassignedTasks'),
    formatter: number
  }
];

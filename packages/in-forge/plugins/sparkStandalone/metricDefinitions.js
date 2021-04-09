/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'workers.aliveWorkers',
      'workers.deadWorkers',
      'workers.decommissionedWorkers',
      'workers.workersInUnknownState'
    ],
    labels: [
      t('in-forge:plugins.sparkStandalone.labelAliveWorkers'),
      t('in-forge:plugins.sparkStandalone.labelDeadWorkers'),
      t('in-forge:plugins.sparkStandalone.labelDecommissionedWorkers'),
      t('in-forge:plugins.sparkStandalone.labelWorkersInUnknownState')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['workers.memoryInUseTotal', 'workers.memoryTotal'],
    labels: [
      t('in-forge:plugins.sparkStandalone.labelUsedMemory'),
      t('in-forge:plugins.sparkStandalone.labelTotalMemory')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['workers.coresInUseTotal', 'workers.coresTotal'],
    labels: [
      t('in-forge:plugins.sparkStandalone.labelUsedCores'),
      t('in-forge:plugins.sparkStandalone.labelTotalCores')
    ],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('workers.metrics', 'memoryUsed', t('in-forge:plugins.sparkStandalone.workerId')),
    label: t('in-forge:plugins.sparkStandalone.labelMemoryUsed'),
    category: [t('in-forge:plugins.sparkStandalone.titleWorkers')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('workers.metrics', 'coresUsed', t('in-forge:plugins.sparkStandalone.workerId')),
    label: t('in-forge:plugins.sparkStandalone.labelCoresUsed'),
    category: [t('in-forge:plugins.sparkStandalone.titleWorkers')],
    min: 0,
    formatter: number
  },
  {
    metric: 'drivers.failed',
    label: t('in-forge:plugins.sparkStandalone.labelNumberFailedDrivers'),
    min: 0,
    formatter: number
  },
  {
    metric: 'apps.failed',
    label: t('in-forge:plugins.sparkStandalone.labelNumberFailedApplications'),
    min: 0,
    formatter: number
  }
];

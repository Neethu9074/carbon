/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['activeNodes', 'lostNodes', 'unhealthyNodes', 'decommissionedNodes'],
    labels: [
      t('in-forge:plugins.hadoopYARN.activeNodes'),
      t('in-forge:plugins.hadoopYARN.lostNodes'),
      t('in-forge:plugins.hadoopYARN.unhealthyNodes'),
      t('in-forge:plugins.hadoopYARN.decommissionedNodes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['appsRunning', 'appsPending', 'appsFailed'],
    labels: [
      t('in-forge:plugins.hadoopYARN.appsRunning'),
      t('in-forge:plugins.hadoopYARN.appsPending'),
      t('in-forge:plugins.hadoopYARN.appsFailed')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['usedMemory', 'availableMemory', 'reservedMemory'],
    labels: [
      t('in-forge:plugins.hadoopYARN.usedMemory'),
      t('in-forge:plugins.hadoopYARN.availableMemory'),
      t('in-forge:plugins.hadoopYARN.reservedMemory')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['usedVirtualCores', 'availableVirtualCores', 'reservedVirtualCores'],
    labels: [
      t('in-forge:plugins.hadoopYARN.usedVirtualCores'),
      t('in-forge:plugins.hadoopYARN.availableVirtualCores'),
      t('in-forge:plugins.hadoopYARN.reservedVirtualCores')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['containersRunning'],
    labels: [t('in-forge:plugins.hadoopYARN.containersRunning')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodes', 'containers', t('in-forge:plugins.hadoopYARN.node')),
    label: t('in-forge:plugins.hadoopYARN.containersRunning'),
    category: [t('in-forge:plugins.hadoopYARN.nodes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodes', 'memoryAvailable', t('in-forge:plugins.hadoopYARN.node')),
    label: t('in-forge:plugins.hadoopYARN.memoryAvailable'),
    category: [t('in-forge:plugins.hadoopYARN.nodes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('nodes', 'memoryUsed', t('in-forge:plugins.hadoopYARN.node')),
    label: t('in-forge:plugins.hadoopYARN.memoryUsed'),
    category: [t('in-forge:plugins.hadoopYARN.nodes')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('nodes', 'virtualCoresAvailable', t('in-forge:plugins.hadoopYARN.node')),
    label: t('in-forge:plugins.hadoopYARN.virtualCoresAvailable'),
    category: [t('in-forge:plugins.hadoopYARN.nodes')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('nodes', 'virtualCoresUsed', t('in-forge:plugins.hadoopYARN.node')),
    label: t('in-forge:plugins.hadoopYARN.virtualCoresUsed'),
    category: [t('in-forge:plugins.hadoopYARN.nodes')],
    min: 0,
    formatter: number
  }
];

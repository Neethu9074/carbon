/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalCoresUsed'],
    labels: [t('in-forge:plugins.powerVCRegion.coresUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalInstancesUsed'],
    labels: [t('in-forge:plugins.powerVCRegion.instanceUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalRAMUsed'],
    labels: [t('in-forge:plugins.powerVCRegion.ramUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalServerGroupsUsed'],
    labels: [t('in-forge:plugins.powerVCRegion.serverGroupsUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalFloatingIpsUsed'],
    labels: [t('in-forge:plugins.powerVCRegion.floatingIpsUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalSecurityGroupsUsed'],
    labels: [t('in-forge:plugins.powerVCRegion.securityGroupsUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('volumes', 'volumeCount', t('in-forge:plugins.powerVCRegion.volumeCount')),
      getDynamicMetricMatch('volumes', 'availableCapacity', t('in-forge:plugins.powerVCRegion.availableCapacity')),
      getDynamicMetricMatch('volumes', 'totalCapacity', t('in-forge:plugins.powerVCRegion.totalCapacity'))
    ],
    labels: [
      t('in-forge:plugins.powerVCRegion.volumeCount'),
      t('in-forge:plugins.powerVCRegion.availableCapacity'),
      t('in-forge:plugins.powerVCRegion.totalCapacity')
    ],
    min: 0,
    formatter: number.perSecond
  }
];

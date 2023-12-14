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
    labels: [t('in-forge:plugins.powervcRegion.coresUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalInstancesUsed'],
    labels: [t('in-forge:plugins.powervcRegion.instanceUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalRAMUsed'],
    labels: [t('in-forge:plugins.powervcRegion.ramUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalServerGroupsUsed'],
    labels: [t('in-forge:plugins.powervcRegion.serverGroupsUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalFloatingIpsUsed'],
    labels: [t('in-forge:plugins.powervcRegion.floatingIpsUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['totalSecurityGroupsUsed'],
    labels: [t('in-forge:plugins.powervcRegion.securityGroupsUsage')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('volumes', 'volumeCount', t('in-forge:plugins.powervcRegion.volumeCount')),
      getDynamicMetricMatch('volumes', 'availableCapacity', t('in-forge:plugins.powervcRegion.availableCapacity')),
      getDynamicMetricMatch('volumes', 'totalCapacity', t('in-forge:plugins.powervcRegion.totalCapacity'))
    ],
    labels: [
      t('in-forge:plugins.powervcRegion.volumeCount'),
      t('in-forge:plugins.powervcRegion.availableCapacity'),
      t('in-forge:plugins.powervcRegion.totalCapacity')
    ],
    min: 0,
    formatter: number.perSecond
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpuUsage.cpcProcessorUsage', 'cpuUsage.channelUsage'],
    labels: [
      t('in-forge:plugins.zHMCApplication.cpcProcessorUsage'),
      t('in-forge:plugins.zHMCApplication.channelUsage')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['cpuUsage.powerConsumptionWatts', 'cpuUsage.temperatureCelsius'],
    labels: [
      t('in-forge:plugins.zHMCApplication.powerConsumptionWatts'),
      t('in-forge:plugins.zHMCApplication.temperature')
    ],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      'cpuUsage.iipAllProcessorUsage',
      'cpuUsage.iflAllProcessorUsage',
      'cpuUsage.icfAllProcessorUsage',
      'cpuUsage.cbpAllProcessorUsage',
      'cpuUsage.cpAllProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zHMCApplication.iip'),
      t('in-forge:plugins.zHMCApplication.ifl'),
      t('in-forge:plugins.zHMCApplication.icf'),
      t('in-forge:plugins.zHMCApplication.cbp'),
      t('in-forge:plugins.zHMCApplication.cp')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      'cpuUsage.iflSharedProcessorUsage',
      'cpuUsage.icfSharedProcessorUsage',
      'cpuUsage.cbpSharedProcessorUsage',
      'cpuUsage.cpSharedProcessorUsage',
      'cpuUsage.aapSharedProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zHMCApplication.ifl'),
      t('in-forge:plugins.zHMCApplication.icf'),
      t('in-forge:plugins.zHMCApplication.cbp'),
      t('in-forge:plugins.zHMCApplication.cp'),
      t('in-forge:plugins.zHMCApplication.aap')
    ],
    min: 0,
    formatter: percentage
  },

  {
    metrics: [
      'cpuUsage.iflDedicatedProcessorUsage',
      'cpuUsage.icfDedicatedProcessorUsage',
      'cpuUsage.cbpDedicatedProcessorUsage',
      'cpuUsage.cpDedicatedProcessorUsage',
      'cpuUsage.aapDedicatedProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zHMCApplication.ifl'),
      t('in-forge:plugins.zHMCApplication.icf'),
      t('in-forge:plugins.zHMCApplication.cbp'),
      t('in-forge:plugins.zHMCApplication.cp'),
      t('in-forge:plugins.zHMCApplication.aap')
    ],
    min: 0,
    formatter: percentage
  },

  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'processor', t('in-forge:plugins.zHMCApplication.logicalPartition'))
    ],
    labels: [t('in-forge:plugins.zHMCApplication.processorUsage')],
    category: [t('in-forge:plugins.zHMCApplication.logicalPartition')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'zvmPagingRate', t('in-forge:plugins.zHMCApplication.logicalPartition'))
    ],
    labels: [t('in-forge:plugins.zHMCApplication.zvm')],
    category: [t('in-forge:plugins.zHMCApplication.logicalPartition')],
    min: 0,
    formatter: number
  },

  {
    metrics: [
      getDynamicMetricMatch(
        'logicalPartition',
        'cpProcessorUsage',
        t('in-forge:plugins.zHMCApplication.logicalPartition')
      ),
      getDynamicMetricMatch(
        'logicalPartition',
        'iflProcessorUsage',
        t('in-forge:plugins.zHMCApplication.logicalPartition')
      ),
      getDynamicMetricMatch(
        'logicalPartition',
        'icfProcessorUsage',
        t('in-forge:plugins.zHMCApplication.logicalPartition')
      ),
      getDynamicMetricMatch(
        'logicalPartition',
        'iipProcessorUsage',
        t('in-forge:plugins.zHMCApplication.logicalPartition')
      ),
      getDynamicMetricMatch(
        'logicalPartition',
        'cbpProcessorUsage',
        t('in-forge:plugins.zHMCApplication.logicalPartition')
      )
    ],
    labels: [
      t('in-forge:plugins.zHMCApplication.cp'),
      t('in-forge:plugins.zHMCApplication.ifl'),
      t('in-forge:plugins.zHMCApplication.icf'),
      t('in-forge:plugins.zHMCApplication.iip'),
      t('in-forge:plugins.zHMCApplication.cbp')
    ],
    category: [t('in-forge:plugins.zHMCApplication.logicalPartition')],
    min: 0,
    formatter: percentage
  }
];

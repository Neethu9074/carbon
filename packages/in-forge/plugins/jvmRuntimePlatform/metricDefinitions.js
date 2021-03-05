/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getCustomMetricMatch, getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { siPrefix, micros, millis, number, bytes, percentage } from 'in-services/formatters/number';

function getLabel(postfix) {
  return (snapshot, match) => (match?.length > 1 ? `${match[1]} ${postfix}` : postfix);
}

export default [
  {
    metrics: ['threads.new', 'threads.runnable', 'threads.timed-waiting', 'threads.waiting', 'threads.blocked'],
    labels: [
      t('in-forge:plugins.jvmRuntimePlatform.new'),
      t('in-forge:plugins.jvmRuntimePlatform.runnable'),
      'Timed-Waiting',
      t('in-forge:plugins.jvmRuntimePlatform.waiting'),
      t('in-forge:plugins.jvmRuntimePlatform.blocked')
    ],
    min: 0,
    category: [t('in-forge:plugins.jvmRuntimePlatform.threads')],
    formatter: number
  },
  {
    metric: 'suspension.time',
    label: t('in-forge:plugins.jvmRuntimePlatform.time'),
    min: 0,
    category: [t('in-forge:plugins.jvmRuntimePlatform.suspension')],
    formatter: micros
  },
  {
    metrics: ['memory.usedPercentage'],
    labels: [t('in-forge:plugins.jvmRuntimePlatform.usedPercentage')],
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.jvmRuntimePlatform.memory')],
    formatter: percentage
  },
  {
    metrics: ['memory.used', 'memory.free'],
    labels: [t('in-forge:plugins.jvmRuntimePlatform.used'), t('in-forge:plugins.jvmRuntimePlatform.free')],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.max']);
    },
    category: [t('in-forge:plugins.jvmRuntimePlatform.memory')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('gc', 'time', 'Garbage Collector'),
    label: getLabel(t('in-forge:plugins.jvmRuntimePlatform.time')),
    category: [t('in-forge:plugins.jvmRuntimePlatform.gc')],
    min: 0,
    formatter: millis.forcedFixedCompact
  },
  {
    metric: getDynamicMetricMatch('gc', 'inv', 'Garbage Collector'),
    label: getLabel(t('in-forge:plugins.jvmRuntimePlatform.invocations')),
    category: [t('in-forge:plugins.jvmRuntimePlatform.gc')],
    min: 0,
    formatter: number
  },
  {
    metric: getCustomMetricMatch('jmx'),
    label(snapshot, metricMatch) {
      return metricMatch;
    },
    min: 0,
    formatter: siPrefix
  },
  {
    metric: 'threads.deadlocked',
    label: t('in-forge:plugins.jvmRuntimePlatform.numberOfThreadsDeadlocked'),
    category: [t('in-forge:plugins.jvmRuntimePlatform.threads')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('pools', null, 'Pool'),
    label: getLabel(t('in-forge:plugins.jvmRuntimePlatform.pool')),
    category: [t('in-forge:plugins.jvmRuntimePlatform.pools')],
    formatter: bytes
  }
];

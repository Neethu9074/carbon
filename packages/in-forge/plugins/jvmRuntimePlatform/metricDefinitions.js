/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { siPrefix, micros, millis, number, bytes, percentage } from 'in-services/formatters/number';
import { getCustomMetricMatch, getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

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
    metrics: ['memory.usedPercentage', 'memory.gc.beforePercentage', 'memory.gc.afterPercentage'],
    labels: [
      t('in-forge:plugins.jvmRuntimePlatform.usedPercentage'),
      t('in-forge:plugins.jvmRuntimePlatform.gcBeforePercentage'),
      t('in-forge:plugins.jvmRuntimePlatform.gcAfterPercentage')
    ],
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.jvmRuntimePlatform.memory')],
    formatter: percentage
  },
  {
    metrics: ['memory.used', 'memory.free', 'memory.gc.before', 'memory.gc.after'],
    labels: [
      t('in-forge:plugins.jvmRuntimePlatform.used'),
      t('in-forge:plugins.jvmRuntimePlatform.free'),
      t('in-forge:plugins.jvmRuntimePlatform.gcBefore'),
      t('in-forge:plugins.jvmRuntimePlatform.gcAfter')
    ],
    min: 0,
    getMax(snapshot) {
      return snapshot.getIn(['data', 'memory.max']);
    },
    category: [t('in-forge:plugins.jvmRuntimePlatform.memory')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('gc', 'time', t('in-forge:plugins.jvmRuntimePlatform.garbageCollector')),
    label: getLabel(t('in-forge:plugins.jvmRuntimePlatform.time')),
    category: [t('in-forge:plugins.jvmRuntimePlatform.gc')],
    min: 0,
    formatter: millis.forcedFixedCompact
  },
  {
    metric: getDynamicMetricMatch('gc', 'inv', t('in-forge:plugins.jvmRuntimePlatform.garbageCollector')),
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
    metric: getDynamicMetricMatch('pools', null, t('in-forge:plugins.jvmRuntimePlatform.pool')),
    label: getLabel(t('in-forge:plugins.jvmRuntimePlatform.pool')),
    category: [t('in-forge:plugins.jvmRuntimePlatform.pools')],
    formatter: bytes
  }
];

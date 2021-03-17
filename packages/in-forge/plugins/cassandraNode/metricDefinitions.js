/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { muSecondsToMillis, percentage, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'clientrequests.read.mean',
      'clientrequests.read.50',
      'clientrequests.read.95',
      'clientrequests.read.99',
      'clientrequests.write.mean',
      'clientrequests.write.50',
      'clientrequests.write.95',
      'clientrequests.write.99'
    ],
    labels: [
      t('in-forge:plugins.cassandraNode.labelMean'),
      t('in-forge:plugins.cassandraNode.label50P'),
      t('in-forge:plugins.cassandraNode.label95P'),
      t('in-forge:plugins.cassandraNode.label99P'),
      t('in-forge:plugins.cassandraNode.labelMean'),
      t('in-forge:plugins.cassandraNode.label50P'),
      t('in-forge:plugins.cassandraNode.label95P'),
      t('in-forge:plugins.cassandraNode.label99P')
    ],
    min: 0,
    category: [t('in-forge:plugins.cassandraNode.latency')],
    formatter: muSecondsToMillis
  },
  {
    metrics: [
      'clientrequests.read.count',
      'clientrequests.write.count',
      'stage.mutation.pending',
      'stage.read.pending',
      'stage.countermutation.pending',
      'stage.readrepair.pending',
      'stage.requestresponse.pending',
      'stage.memtableflushwriter.pending',
      'stage.mutation.blocked',
      'stage.read.blocked',
      'stage.countermutation.blocked',
      'stage.readrepair.blocked',
      'stage.requestresponse.blocked',
      'stage.memtableflushwriter.blocked',
      'dropped.MUTATION',
      'dropped.READ',
      'dropped.COUNTER_MUTATION',
      'dropped.READ_REPAIR',
      'dropped.REQUEST_RESPONSE',
      'compaction.pending'
    ],
    labels: [
      t('in-forge:plugins.cassandraNode.labelRead'),
      t('in-forge:plugins.cassandraNode.labelWrite'),
      t('in-forge:plugins.cassandraNode.labelMutationPending'),
      t('in-forge:plugins.cassandraNode.labelReadPending'),
      t('in-forge:plugins.cassandraNode.labelCounterMutationPending'),
      t('in-forge:plugins.cassandraNode.labelReadRepairPending'),
      t('in-forge:plugins.cassandraNode.labelRequestResponsePending'),
      t('in-forge:plugins.cassandraNode.labelFlushwriterPending'),
      t('in-forge:plugins.cassandraNode.labelMutationBlocked'),
      t('in-forge:plugins.cassandraNode.labelReadBlocked'),
      t('in-forge:plugins.cassandraNode.labelCounterMutationBlocked'),
      t('in-forge:plugins.cassandraNode.labelReadRepairBlocked'),
      t('in-forge:plugins.cassandraNode.labelRequestResponseBlocked'),
      t('in-forge:plugins.cassandraNode.labelFlushwriterBlocked'),
      t('in-forge:plugins.cassandraNode.labelMutationDropped'),
      t('in-forge:plugins.cassandraNode.labelReadDropped'),
      t('in-forge:plugins.cassandraNode.labelCounterMutationDropped'),
      t('in-forge:plugins.cassandraNode.labelReadRepairDropped'),
      t('in-forge:plugins.cassandraNode.labelRequestResponseDropped'),
      t('in-forge:plugins.cassandraNode.labelCompactionPending')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cache.counter.hit', 'cache.key.hit', 'cache.row.hit', 'bloomFilterFalse'],
    labels: [
      t('in-forge:plugins.cassandraNode.labelCounter'),
      t('in-forge:plugins.cassandraNode.labelKey'),
      t('in-forge:plugins.cassandraNode.labelRow'),
      t('in-forge:plugins.cassandraNode.labelMissRate')
    ],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'readLatency', 'Keyspace'),
    label: t('in-forge:plugins.cassandraNode.labelAverageReadLatency'),
    category: [t('in-forge:plugins.cassandraNode.keyspaces')],
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'writeLatency', 'Keyspace'),
    label: t('in-forge:plugins.cassandraNode.labelAverageWriteLatency'),
    category: [t('in-forge:plugins.cassandraNode.keyspaces')],
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'reads', 'Keyspace'),
    label: t('in-forge:plugins.cassandraNode.labelReads'),
    category: [t('in-forge:plugins.cassandraNode.keyspaces')],
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'writes', 'Keyspace'),
    label: t('in-forge:plugins.cassandraNode.labelWrites'),
    category: [t('in-forge:plugins.cassandraNode.keyspaces')],
    min: 0,
    formatter: muSecondsToMillis
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { muSecondsToMillis, percentage, number } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
      'Mean',
      '50th Percentile',
      '95th Percentile',
      '99th Percentile',
      'Mean',
      '50th Percentile',
      '95th Percentile',
      '99th Percentile'
    ],
    min: 0,
    category: ['Latency'],
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
      'Read',
      'Write',
      'Mutation Pending',
      'Read Pending',
      'Counter Mutation Pending',
      'Read Repair Pending',
      'Request Response Pending',
      'Flushwriter Pending',
      'Mutation Blocked',
      'Read Blocked',
      'Counter Mutation Blocked',
      'Read Repair Blocked',
      'Request Response Blocked',
      'Flushwriter Blocked',
      'Mutation Dropped',
      'Read Dropped',
      'Counter Mutation Dropped',
      'Read Repair Dropped',
      'Request Response Dropped',
      'Compaction Pending'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cache.counter.hit', 'cache.key.hit', 'cache.row.hit', 'bloomFilterFalse'],
    labels: ['Counter', 'Key', 'Row', 'Miss Rate'],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'readLatency', 'Keyspace'),
    label: 'Average Read Latency',
    category: ['Keyspaces'],
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'writeLatency', 'Keyspace'),
    label: 'Average Write Latency',
    category: ['Keyspaces'],
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'reads', 'Keyspace'),
    label: 'Reads',
    category: ['Keyspaces'],
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getDynamicMetricMatch('keyspace', 'writes', 'Keyspace'),
    label: 'Writes',
    category: ['Keyspaces'],
    min: 0,
    formatter: muSecondsToMillis
  }
];

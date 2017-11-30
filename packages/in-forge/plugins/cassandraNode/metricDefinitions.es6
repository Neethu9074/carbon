import { muSecondsToMillis, percentage, number } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

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
      'Write (Mutation)',
      'Read',
      'Counter Mutation',
      'Read Repair',
      'Request/Response',
      'Memtable Flushwriter',
      'Write (Mutation)',
      'Read',
      'Counter Mutation',
      'Read Repair',
      'Request/Response',
      'Memtable Flushwriter',
      'Write (Mutation)',
      'Read',
      'Counter Mutation',
      'Read Repair',
      'Request/Response',
      'Compactions',
      'Read',
      'Write'
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
    metric: getMetricMatch('keyspace', 'readLatency'),
    label: 'Average Read Latency',
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getMetricMatch('keyspace', 'writeLatency'),
    label: 'Average Write Latency',
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getMetricMatch('keyspace', 'reads'),
    label: 'Reads',
    min: 0,
    formatter: muSecondsToMillis
  },
  {
    metric: getMetricMatch('keyspace', 'writes'),
    label: 'Writes',
    min: 0,
    formatter: muSecondsToMillis
  }
];

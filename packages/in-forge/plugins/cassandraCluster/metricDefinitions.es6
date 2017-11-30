import { muSecondsToMillis, number, bytes } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: ['clientrequests.read.count', 'clientrequests.write.count'],
    labels: ['Read', 'Write'],
    min: 0,
    formatter: number
  },
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
    metrics: ['overallDiskSize'],
    labels: ['Overall Disk Size'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['keyspaceCount'],
    labels: ['Keyspaces'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['nodeCount'],
    labels: ['Cluster Nodes'],
    min: 0,
    formatter: number
  },
  {
    metric: getMetricMatch('keyspace', 'diskSize'),
    label: 'Disk Size',
    min: 0,
    formatter: bytes
  }
];

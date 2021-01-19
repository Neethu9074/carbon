/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage, millis, number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
    labels: ['In', 'Out', 'Rejected'],
    min: 0,
    category: ['Traffic'],
    formatter: bytes
  },
  {
    metrics: ['broker.produceRequests', 'broker.fetchConsumerRequests', 'broker.fetchFollowerRequests'],
    labels: ['Produce Throughput', 'Fetch Consumer Throughput', 'Fetch Follower Throughput'],
    min: 0,
    category: ['Throughput'],
    formatter: number
  },
  {
    metrics: ['broker.totalTimeProduce', 'broker.totalTimeFetchConsumer', 'broker.totalTimeFetchFollower'],
    labels: ['Produce Latency', 'Fetch Consumer Latency', 'Fetch Follower Latency'],
    min: 0,
    category: ['Latency'],
    formatter: millis
  },
  {
    metrics: ['broker.failedFetch', 'broker.failedProduce'],
    labels: ['Fetch', 'Produce'],
    min: 0,
    category: ['Failures'],
    formatter: number
  },
  {
    metrics: [
      'broker.underReplicatedPartitions',
      'broker.offlinePartitionsCount',
      'broker.leaderElections',
      'broker.uncleanLeaderElections',
      'broker.isrShrinks',
      'broker.isrExpansions',
      'broker.activeControllerCount'
    ],
    labels: [
      'Under-replicated Partitions',
      'Offline Partitions',
      'Leader Elections',
      'Unclean Leader Elections',
      'ISR Shrinks',
      'ISR Expansions',
      'Active controller count'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['broker.networkProcessorIdle', 'broker.requestHandlerIdle'],
    labels: ['Network Processor', 'Request Handler'],
    min: 0,
    category: ['Idle Times'],
    formatter: percentage
  },
  {
    metrics: ['broker.partitionCount', 'broker.messagesIn', 'logflush.inv'],
    labels: ['Count', 'Messages In', 'Log Flushes'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['logflush.mean'],
    labels: ['Log Flush Mean'],
    min: 0,
    formatter: millis
  }
];

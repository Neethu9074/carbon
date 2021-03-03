/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { percentage, millis, number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['broker.bytesIn', 'broker.bytesOut', 'broker.bytesRejected'],
    labels: [t('in-forge:plugins.kafka.in'), t('in-forge:plugins.kafka.out'), t('in-forge:plugins.kafka.rejected')],
    min: 0,
    category: [t('in-forge:plugins.kafka.traffic')],
    formatter: bytes
  },
  {
    metrics: ['broker.produceRequests', 'broker.fetchConsumerRequests', 'broker.fetchFollowerRequests'],
    labels: [
      t('in-forge:plugins.kafka.produceThroughput'),
      t('in-forge:plugins.kafka.fetchConsumerThroughput'),
      t('in-forge:plugins.kafka.fetchFollowerThroughput')
    ],
    min: 0,
    category: [t('in-forge:plugins.kafka.throughput')],
    formatter: number
  },
  {
    metrics: ['broker.totalTimeProduce', 'broker.totalTimeFetchConsumer', 'broker.totalTimeFetchFollower'],
    labels: [
      t('in-forge:plugins.kafka.produceLatency'),
      t('in-forge:plugins.kafka.fetchConsumerLatency'),
      t('in-forge:plugins.kafka.fetchFollowerLatency')
    ],
    min: 0,
    category: [t('in-forge:plugins.kafka.latency')],
    formatter: millis
  },
  {
    metrics: ['broker.failedFetch', 'broker.failedProduce'],
    labels: [t('in-forge:plugins.kafka.fetch'), t('in-forge:plugins.kafka.produce')],
    min: 0,
    category: [t('in-forge:plugins.kafka.failures')],
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
      t('in-forge:plugins.kafka.underReplicatedPartitions'),
      t('in-forge:plugins.kafka.offlinePartitions'),
      t('in-forge:plugins.kafka.leaderElections'),
      t('in-forge:plugins.kafka.uncleanLeaderElections'),
      t('in-forge:plugins.kafka.isrShrinks'),
      t('in-forge:plugins.kafka.isrExpansions'),
      t('in-forge:plugins.kafka.activeControllerCount')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['broker.networkProcessorIdle', 'broker.requestHandlerIdle'],
    labels: [t('in-forge:plugins.kafka.networkProcessor'), t('in-forge:plugins.kafka.requestHandler')],
    min: 0,
    category: [t('in-forge:plugins.kafka.idleTimes')],
    formatter: percentage
  },
  {
    metrics: ['broker.partitionCount', 'broker.messagesIn', 'logflush.inv'],
    labels: [
      t('in-forge:plugins.kafka.count'),
      t('in-forge:plugins.kafka.messagesIn'),
      t('in-forge:plugins.kafka.logFlushes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['logflush.mean'],
    labels: [t('in-forge:plugins.kafka.logFlushMean')],
    min: 0,
    formatter: millis
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  siPrefix,
  number,
  bytesPerSecondTwoDecimalPlaces,
  millis,
  bytes,
  percentageZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: 'broker.produceRequests',
    label: t('in-forge:plugins.kafkaCluster.produceThroughput'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'broker.fetchConsumerRequests',
    label: t('in-forge:plugins.kafkaCluster.fetchConsumerThroughput'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'broker.fetchFollowerRequests',
    label: t('in-forge:plugins.kafkaCluster.fetchFollowerThroughput'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'broker.totalTimeProduce',
    label: t('in-forge:plugins.kafkaCluster.produceLatency'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'broker.totalTimeFetchConsumer',
    label: t('in-forge:plugins.kafkaCluster.fetchConsumerLatency'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'broker.totalTimeFetchFollower',
    label: t('in-forge:plugins.kafkaCluster.fetchFollowerLatency'),
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'broker.bytesIn',
    label: t('in-forge:plugins.kafkaCluster.bytesIn'),
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'broker.bytesOut',
    label: t('in-forge:plugins.kafkaCluster.bytesOut'),
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'broker.bytesRejected',
    label: t('in-forge:plugins.kafkaCluster.bytesRejected'),
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'broker.messagesIn',
    label: t('in-forge:plugins.kafkaCluster.allBrokersMessagesIn'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.failedFetch',
    label: t('in-forge:plugins.kafkaCluster.allBrokersFetchFailures'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.failedProduce',
    label: t('in-forge:plugins.kafkaCluster.allBrokersProduceFailures'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.underReplicatedPartitions',
    label: t('in-forge:plugins.kafkaCluster.underReplicatedPartitions'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.offlinePartitionsCount',
    label: t('in-forge:plugins.kafkaCluster.offlinePartitions'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.leaderElections',
    label: t('in-forge:plugins.kafkaCluster.leaderElections'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.uncleanLeaderElections',
    label: t('in-forge:plugins.kafkaCluster.uncleanLeaderElections'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.isrShrinks',
    label: t('in-forge:plugins.kafkaCluster.isrShrinks'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.isrExpansions',
    label: t('in-forge:plugins.kafkaCluster.isrExpansions'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.activeControllerCount',
    label: t('in-forge:plugins.kafkaCluster.activeControllerCount'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.networkProcessorIdle',
    label: t('in-forge:plugins.kafkaCluster.networkProcessorIdleTime'),
    min: 0,
    formatter: percentageZeroDecimalPlaces
  },
  {
    metric: 'broker.requestHandlerIdle',
    label: t('in-forge:plugins.kafkaCluster.requestHandlerIdleTime'),
    min: 0,
    formatter: percentageZeroDecimalPlaces
  },
  {
    metric: 'logflush.mean',
    label: t('in-forge:plugins.kafkaCluster.logFlushingMean'),
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'logflush.inv',
    label: t('in-forge:plugins.kafkaCluster.logFlushes'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'nodeCount',
    label: t('in-forge:plugins.kafkaCluster.nodes'),
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getDynamicMetricMatch('broker.lagData.data', 'lag', 'Topic'),
    label: t('in-forge:plugins.kafkaCluster.consumerGroupLag'),
    category: [t('in-forge:plugins.kafkaCluster.topics')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'bytesInPerSec', 'Topic'),
    label: t('in-forge:plugins.kafkaCluster.bytesInPerSecond'),
    category: [t('in-forge:plugins.kafkaCluster.topics')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'bytesOutPerSec', 'Topic'),
    label: t('in-forge:plugins.kafkaCluster.bytesOutPerSecond'),
    category: [t('in-forge:plugins.kafkaCluster.topics')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'bytesRejectedPerSec', 'Topic'),
    label: t('in-forge:plugins.kafkaCluster.bytesRejectedPerSecond'),
    category: [t('in-forge:plugins.kafkaCluster.topics')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'messagesInPerSec', 'Topic'),
    label: t('in-forge:plugins.kafkaCluster.messagesInPerSecond'),
    category: [t('in-forge:plugins.kafkaCluster.topics')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.producer', 'producerOutgoingByteRate', 'Producer'),
    label: t('in-forge:plugins.kafkaCluster.byteRate'),
    category: [t('in-forge:plugins.kafkaCluster.producers')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.producer', 'produceThrottleTime', 'Producer'),
    label: t('in-forge:plugins.kafkaCluster.throttling'),
    category: [t('in-forge:plugins.kafkaCluster.producers')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.producer', 'produceRequestLatency', 'Producer'),
    label: t('in-forge:plugins.kafkaCluster.latency'),
    category: [t('in-forge:plugins.kafkaCluster.producers')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.consumer', 'consumedByteRate', 'Consumer'),
    label: t('in-forge:plugins.kafkaCluster.byteRate'),
    category: [t('in-forge:plugins.kafkaCluster.consumers')],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.consumer', 'consumerFetchThrottleTime', 'Consumer'),
    label: t('in-forge:plugins.kafkaCluster.throttling'),
    category: [t('in-forge:plugins.kafkaCluster.consumers')],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.consumer', 'consumerFetchLatency', 'Consumer'),
    label: t('in-forge:plugins.kafkaCluster.latency'),
    category: [t('in-forge:plugins.kafkaCluster.consumers')],
    min: 0,
    formatter: millis
  }
];

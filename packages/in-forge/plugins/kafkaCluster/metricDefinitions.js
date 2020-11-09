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

export default [
  {
    metric: 'broker.produceRequests',
    label: 'Produce Throughput',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'broker.fetchConsumerRequests',
    label: 'Fetch Consumer Throughput',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'broker.fetchFollowerRequests',
    label: 'Fetch Follower Throughput',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'broker.totalTimeProduce',
    label: 'Produce Latency',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'broker.totalTimeFetchConsumer',
    label: 'Fetch Consumer Latency',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'broker.totalTimeFetchFollower',
    label: 'Fetch Follower Latency',
    min: 0,
    formatter: millis.compact
  },
  {
    metric: 'broker.bytesIn',
    label: 'Bytes In',
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'broker.bytesOut',
    label: 'Bytes Out',
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'broker.bytesRejected',
    label: 'Bytes Rejected',
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'broker.messagesIn',
    label: 'All Brokers Messages In',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.failedFetch',
    label: 'All Brokers Fetch Failures',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.failedProduce',
    label: 'All Brokers Produce Failures',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.underReplicatedPartitions',
    label: 'Under-replicated Partitions',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.offlinePartitionsCount',
    label: 'Offline Partitions',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.leaderElections',
    label: 'Leader Elections',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.uncleanLeaderElections',
    label: 'Unclean Leader Elections',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.isrShrinks',
    label: 'ISR Shrinks',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.isrExpansions',
    label: 'ISR Expansions',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.activeControllerCount',
    label: 'Active Controller Count',
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'broker.networkProcessorIdle',
    label: 'Network Processor Idle Time',
    min: 0,
    formatter: percentageZeroDecimalPlaces
  },
  {
    metric: 'broker.requestHandlerIdle',
    label: 'Request Handler Idle Time',
    min: 0,
    formatter: percentageZeroDecimalPlaces
  },
  {
    metric: 'logflush.mean',
    label: 'Log Flushing Mean',
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'logflush.inv',
    label: 'Log Flushes',
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'nodeCount',
    label: 'Nodes',
    min: 0,
    formatter: siPrefix
  },
  {
    metric: getDynamicMetricMatch('broker.lagData.data', 'lag', 'Topic'),
    label: 'Consumer Group Lag',
    category: ['Topics'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'bytesInPerSec', 'Topic'),
    label: 'Bytes In Per Second',
    category: ['Topics'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'bytesOutPerSec', 'Topic'),
    label: 'Bytes Out Per Second',
    category: ['Topics'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'bytesRejectedPerSec', 'Topic'),
    label: 'Bytes Rejected Per Second',
    category: ['Topics'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('broker.topicData', 'messagesInPerSec', 'Topic'),
    label: 'Messages In Per Second',
    category: ['Topics'],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.producer', 'producerOutgoingByteRate', 'Producer'),
    label: 'Byte Rate',
    category: ['Producers'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.producer', 'produceThrottleTime', 'Producer'),
    label: 'Throttling',
    category: ['Producers'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.producer', 'produceRequestLatency', 'Producer'),
    label: 'Latency',
    category: ['Producers'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.consumer', 'consumedByteRate', 'Consumer'),
    label: 'Byte Rate',
    category: ['Consumers'],
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.consumer', 'consumerFetchThrottleTime', 'Consumer'),
    label: 'Throttling',
    category: ['Consumers'],
    min: 0,
    formatter: millis
  },
  {
    metric: getDynamicMetricMatch('kafkaClient.consumer', 'consumerFetchLatency', 'Consumer'),
    label: 'Latency',
    category: ['Consumers'],
    min: 0,
    formatter: millis
  }
];

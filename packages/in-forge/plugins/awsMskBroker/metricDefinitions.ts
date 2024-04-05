/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, bytes, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'bytes_in_ser_sec',
    label: t('in-forge:plugins.awsMskBroker.bytesInPerSecond'),
    category: [t('in-forge:plugins.awsMskBroker.brokerTraffic')],
    formatter: bytes
  },
  {
    metric: 'bytes_out_per_sec',
    label: t('in-forge:plugins.awsMskBroker.bytesOutPerSecond'),
    category: [t('in-forge:plugins.awsMskBroker.brokerTraffic')],
    formatter: bytes
  },
  {
    metric: 'messages_in_per_sec',
    label: t('in-forge:plugins.awsMskBroker.messagesInPerSecond'),
    category: [t('in-forge:plugins.awsMskBroker.brokerTraffic')],
    formatter: number
  },
  {
    metric: 'partition_count',
    label: t('in-forge:plugins.awsMskBroker.partitionCount'),
    category: [t('in-forge:plugins.awsMskBroker.partition')],
    formatter: number
  },
  {
    metric: 'under_replicated_partitions',
    label: t('in-forge:plugins.awsMskBroker.underReplicatedPartitionCount'),
    category: [t('in-forge:plugins.awsMskBroker.partition')],
    formatter: number
  },
  {
    metric: 'leader_count',
    label: t('in-forge:plugins.awsMskBroker.leaderCount'),
    category: [t('in-forge:plugins.awsMskBroker.partition')],
    formatter: number
  },
  {
    metric: 'request_throttle_time',
    label: t('in-forge:plugins.awsMskBroker.requestThrottleTime'),
    category: [t('in-forge:plugins.awsMskBroker.throttleTime')],
    formatter: millis
  },
  {
    metric: 'produce_throttle_time',
    label: t('in-forge:plugins.awsMskBroker.produceThrottleTime'),
    category: [t('in-forge:plugins.awsMskBroker.throttleTime')],
    formatter: millis
  },
  {
    metric: 'produce_throttle_byte_rate',
    label: t('in-forge:plugins.awsMskBroker.produceThrottleByteRate'),
    category: [t('in-forge:plugins.awsMskBroker.throttleBbyteRate')],
    formatter: number.perSecond
  },
  {
    metric: 'fetch_throttle_time',
    label: t('in-forge:plugins.awsMskBroker.fetchThrottleTime'),
    category: [t('in-forge:plugins.awsMskBroker.throttleTime')],
    formatter: millis
  },
  {
    metric: 'fetch_throttle_byte_rate',
    label: t('in-forge:plugins.awsMskBroker.fetchThrottleByteRate'),
    category: [t('in-forge:plugins.awsMskBroker.throttleBbyteRate')],
    formatter: number.perSecond
  },
  {
    metric: 'cpu_idle',
    label: t('in-forge:plugins.awsMskBroker.cpuIdle'),
    category: [t('in-forge:plugins.awsMskBroker.cpu')],
    formatter: percentage
  },
  {
    metric: 'cpu_user',
    label: t('in-forge:plugins.awsMskBroker.cpuUser'),
    category: [t('in-forge:plugins.awsMskBroker.cpu')],
    formatter: percentage
  },
  {
    metric: 'cpu_system',
    label: t('in-forge:plugins.awsMskBroker.cpuSystem'),
    category: [t('in-forge:plugins.awsMskBroker.cpu')],
    formatter: percentage
  },
  {
    metric: 'memory_free',
    label: t('in-forge:plugins.awsMskBroker.memoryFree'),
    category: [t('in-forge:plugins.awsMskBroker.memory')],
    formatter: bytes
  },
  {
    metric: 'memory_used',
    label: t('in-forge:plugins.awsMskBroker.memoryUsed'),
    category: [t('in-forge:plugins.awsMskBroker.memory')],
    formatter: bytes
  },
  {
    metric: 'memory_cached',
    label: t('in-forge:plugins.awsMskBroker.memoryCached'),
    category: [t('in-forge:plugins.awsMskBroker.memory')],
    formatter: bytes
  },
  {
    metric: 'memory_buffered',
    label: t('in-forge:plugins.awsMskBroker.memoryBuffered'),
    category: [t('in-forge:plugins.awsMskBroker.memory')],
    formatter: bytes
  },
  {
    metric: 'swap_free',
    label: t('in-forge:plugins.awsMskBroker.swapFfree'),
    category: [t('in-forge:plugins.awsMskBroker.memory')],
    formatter: bytes
  },
  {
    metric: 'swap_used',
    label: t('in-forge:plugins.awsMskBroker.swapUused'),
    category: [t('in-forge:plugins.awsMskBroker.memory')],
    formatter: bytes
  },
  {
    metric: 'network_rx_packets',
    label: t('in-forge:plugins.awsMskBroker.networkReceivedPackages'),
    category: [t('in-forge:plugins.awsMskBroker.network')],
    formatter: number
  },
  {
    metric: 'network_rx_dropped',
    label: t('in-forge:plugins.awsMskBroker.networkDroppedReceivePackages'),
    category: [t('in-forge:plugins.awsMskBroker.network')],
    formatter: number
  },
  {
    metric: 'network_rx_errors',
    label: t('in-forge:plugins.awsMskBroker.networkReceiveErrors'),
    category: [t('in-forge:plugins.awsMskBroker.network')],
    formatter: number
  },
  {
    metric: 'network_tx_packets',
    label: t('in-forge:plugins.awsMskBroker.networkTransmittedPackages'),
    category: [t('in-forge:plugins.awsMskBroker.network')],
    formatter: number
  },
  {
    metric: 'network_tx_dropped',
    label: t('in-forge:plugins.awsMskBroker.networkDroppedTransmitPackages'),
    category: [t('in-forge:plugins.awsMskBroker.network')],
    formatter: number
  },
  {
    metric: 'network_tx_errors',
    label: t('in-forge:plugins.awsMskBroker.networkTransmitErrors'),
    category: [t('in-forge:plugins.awsMskBroker.network')],
    formatter: number
  },
  {
    metric: 'fetch_consumer_total_time',
    label: t('in-forge:plugins.awsMskBroker.fetchConsumerTotalTime'),
    category: [t('in-forge:plugins.awsMskBroker.fetchTime')],
    formatter: millis
  },
  {
    metric: 'fetch_follower_total_time',
    label: t('in-forge:plugins.awsMskBroker.fetchFollowerTotalTime'),
    category: [t('in-forge:plugins.awsMskBroker.fetchTime')],
    formatter: millis
  },
  {
    metric: 'produce_total_time',
    label: t('in-forge:plugins.awsMskBroker.produceTotalTime'),
    category: [t('in-forge:plugins.awsMskBroker.produceTime')],
    formatter: millis
  },
  {
    metric: 'request_bytes_mean',
    label: t('in-forge:plugins.awsMskBroker.requestBytes'),
    category: [t('in-forge:plugins.awsMskBroker.request')],
    formatter: bytes
  },
  {
    metric: 'network_processor_idle',
    label: t('in-forge:plugins.awsMskBroker.networkProcessorIdle'),
    category: [t('in-forge:plugins.awsMskBroker.idleTime')],
    formatter: percentage
  },
  {
    metric: 'request_handler_idle',
    label: t('in-forge:plugins.awsMskBroker.requestHandlerIdle'),
    category: [t('in-forge:plugins.awsMskBroker.idleTime')],
    formatter: percentage
  }
];

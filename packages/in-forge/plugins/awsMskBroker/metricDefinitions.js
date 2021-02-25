/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, percentage, bytes, millis } from 'in-services/formatters/number';

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
    label: 'Produce throttle byte rate',
    category: ['Throttle byte rate'],
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
    label: 'Fetch throttle byte rate',
    category: ['Throttle byte rate'],
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
    label: 'Memory free',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'memory_used',
    label: 'Memory used',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'memory_cached',
    label: 'Memory cached',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'memory_buffered',
    label: 'Memory buffered',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'swap_free',
    label: 'Swap free',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'swap_used',
    label: 'Swap used',
    category: ['Memory'],
    formatter: bytes
  },
  {
    metric: 'network_rx_packets',
    label: 'Network received packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_rx_dropped',
    label: 'Network dropped receive packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_rx_errors',
    label: 'Network receive errors',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_tx_packets',
    label: 'Network transmitted packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_tx_dropped',
    label: 'Network dropped transmit packages',
    category: ['Network'],
    formatter: number
  },
  {
    metric: 'network_tx_errors',
    label: 'Network transmit errors',
    category: ['Network'],
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

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpcProcessorUsage', 'channelUsage'],
    labels: [t('in-forge:plugins.zhmcCpc.cpcProcessorUsage'), t('in-forge:plugins.zhmcCpc.channelUsage')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['powerConsumptionWatts', 'temperatureCelsius'],
    labels: [t('in-forge:plugins.zhmcCpc.powerConsumptionWatts'), t('in-forge:plugins.zhmcCpc.temperature')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'iipAllProcessorUsage',
      'iflAllProcessorUsage',
      'icfAllProcessorUsage',
      'cbpAllProcessorUsage',
      'cpAllProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.iip'),
      t('in-forge:plugins.zhmcCpc.ifl'),
      t('in-forge:plugins.zhmcCpc.icf'),
      t('in-forge:plugins.zhmcCpc.cbp'),
      t('in-forge:plugins.zhmcCpc.cp')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      'iflSharedProcessorUsage',
      'icfSharedProcessorUsage',
      'cbpSharedProcessorUsage',
      'cpSharedProcessorUsage',
      'aapSharedProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.ifl'),
      t('in-forge:plugins.zhmcCpc.icf'),
      t('in-forge:plugins.zhmcCpc.cbp'),
      t('in-forge:plugins.zhmcCpc.cp'),
      t('in-forge:plugins.zhmcCpc.aap')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      'iflDedicatedProcessorUsage',
      'icfDedicatedProcessorUsage',
      'cbpDedicatedProcessorUsage',
      'cpDedicatedProcessorUsage',
      'aapDedicatedProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.ifl'),
      t('in-forge:plugins.zhmcCpc.icf'),
      t('in-forge:plugins.zhmcCpc.cbp'),
      t('in-forge:plugins.zhmcCpc.cp'),
      t('in-forge:plugins.zhmcCpc.aap')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['envPowerConsumptionWatts', 'heatLoad', 'heatLoadForcedAir', 'heatLoadWater'],
    labels: [
      t('in-forge:plugins.zhmcCpc.powerConsumptionWatts'),
      t('in-forge:plugins.zhmcCpc.heatLoad'),
      t('in-forge:plugins.zhmcCpc.heatLoadForcedAir'),
      t('in-forge:plugins.zhmcCpc.heatLoadWater')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['envTemperatureCelsius', 'dewPointCelsius', 'humidity', 'exhaustTemperatureCelsius'],
    labels: [
      t('in-forge:plugins.zhmcCpc.temperature'),
      t('in-forge:plugins.zhmcCpc.dewPoint'),
      t('in-forge:plugins.zhmcCpc.humidity'),
      t('in-forge:plugins.zhmcCpc.temperature')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['processorUsage', 'networkUsage'],
    labels: [t('in-forge:plugins.zhmcCpc.processorUsage'), t('in-forge:plugins.zhmcCpc.networkUsage')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['dpmPowerConsumptionWatts', 'dpmTemperatureCelsius'],
    labels: [t('in-forge:plugins.zhmcCpc.powerConsumptionWatts'), t('in-forge:plugins.zhmcCpc.temperature')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storageUsage', 'acceleratorUsage', 'dpmCryptoUsage'],
    labels: [
      t('in-forge:plugins.zhmcCpc.storageUsage'),
      t('in-forge:plugins.zhmcCpc.acceleratorUsage'),
      t('in-forge:plugins.zhmcCpc.cryptoUsage')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      'dpmCpSharedProcessorUsage',
      'dpmCpAllProcessorUsage',
      'dpmIflSharedProcessorUsage',
      'dpmIflAllProcessorUsage',
      'dpmAllSharedProcessorUsage'
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.cpSharedProcessorUsage'),
      t('in-forge:plugins.zhmcCpc.cpAllProcessorUsage'),
      t('in-forge:plugins.zhmcCpc.iflSharedProcessorUsage'),
      t('in-forge:plugins.zhmcCpc.iflAllProcessorUsage'),
      t('in-forge:plugins.zhmcCpc.allSharedProcessorUsage')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [getDynamicMetricMatch('logicalPartitions', 'processor', t('in-forge:plugins.zhmcCpc.logicalPartition'))],
    labels: [t('in-forge:plugins.zhmcCpc.processorUsage')],
    category: [t('in-forge:plugins.zhmcCpc.logicalPartition')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('logicalPartitions', 'zvmPagingRate', t('in-forge:plugins.zhmcCpc.logicalPartition'))
    ],
    labels: [t('in-forge:plugins.zhmcCpc.zvm')],
    category: [t('in-forge:plugins.zhmcCpc.logicalPartition')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('logicalPartitions', 'cpProcessorUsage', t('in-forge:plugins.zhmcCpc.logicalPartition')),
      getDynamicMetricMatch('logicalPartitions', 'iflProcessorUsage', t('in-forge:plugins.zhmcCpc.logicalPartition')),
      getDynamicMetricMatch('logicalPartitions', 'icfProcessorUsage', t('in-forge:plugins.zhmcCpc.logicalPartition')),
      getDynamicMetricMatch('logicalPartitions', 'iipProcessorUsage', t('in-forge:plugins.zhmcCpc.logicalPartition')),
      getDynamicMetricMatch('logicalPartitions', 'cbpProcessorUsage', t('in-forge:plugins.zhmcCpc.logicalPartition'))
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.cp'),
      t('in-forge:plugins.zhmcCpc.ifl'),
      t('in-forge:plugins.zhmcCpc.icf'),
      t('in-forge:plugins.zhmcCpc.iip'),
      t('in-forge:plugins.zhmcCpc.cbp')
    ],
    category: [t('in-forge:plugins.zhmcCpc.logicalPartition')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('logicalPartitions', 'lparPowerConsumption', t('in-forge:plugins.zhmcCpc.logicalPartition'))
    ],
    labels:[
      t('in-forge:plugins.zhmcCpc.lparPowerConsumption')
    ],
    category: [t('in-forge:plugins.zhmcCpc.logicalPartition')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'utilization', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'flags', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'networkPortId', t('in-forge:plugins.zhmcCpc.networkPort'))
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.utilization'),
      t('in-forge:plugins.zhmcCpc.flags'),
      t('in-forge:plugins.zhmcCpc.networkPortId')
    ],
    category: [t('in-forge:plugins.zhmcCpc.networkPorts')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'bytesSent', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'bytesReceived', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'intervalBytesSent', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'intervalBytesReceived', t('in-forge:plugins.zhmcCpc.networkPort'))
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.bytesSent'),
      t('in-forge:plugins.zhmcCpc.bytesReceived'),
      t('in-forge:plugins.zhmcCpc.intervalBytesSent'),
      t('in-forge:plugins.zhmcCpc.intervalBytesReceived')
    ],
    category: [t('in-forge:plugins.zhmcCpc.networkPorts')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'bytesPerSecondSent', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'bytesPerSecondReceived', t('in-forge:plugins.zhmcCpc.networkPort'))
    ],
    labels: [t('in-forge:plugins.zhmcCpc.bytesPerSecondSent'), t('in-forge:plugins.zhmcCpc.bytesPerSecondReceived')],
    category: [t('in-forge:plugins.zhmcCpc.networkPorts')],
    min: 0,
    formatter: bytes.perSecond
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'packetsSent', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'packetsReceived', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'packetsSentDiscarded', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'packetsReceivedDropped', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'packetsReceivedDiscarded', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'multicastPacketsSent', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'multicastPacketsReceived', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'broadcastPacketsSent', t('in-forge:plugins.zhmcCpc.networkPort')),
      getDynamicMetricMatch('networkPorts', 'broadcastPacketsReceived', t('in-forge:plugins.zhmcCpc.networkPort'))
    ],
    labels: [
      t('in-forge:plugins.zhmcCpc.packetsSent'),
      t('in-forge:plugins.zhmcCpc.packetsReceived'),
      t('in-forge:plugins.zhmcCpc.packetsSentDiscarded'),
      t('in-forge:plugins.zhmcCpc.packetsReceivedDropped'),
      t('in-forge:plugins.zhmcCpc.packetsReceivedDiscarded'),
      t('in-forge:plugins.zhmcCpc.multicastPacketsSent'),
      t('in-forge:plugins.zhmcCpc.multicastPacketsReceived'),
      t('in-forge:plugins.zhmcCpc.broadcastPacketsSent'),
      t('in-forge:plugins.zhmcCpc.broadcastPacketsReceived')
    ],
    category: [t('in-forge:plugins.zhmcCpc.networkPorts')],
    min: 0,
    formatter: number
  }
];

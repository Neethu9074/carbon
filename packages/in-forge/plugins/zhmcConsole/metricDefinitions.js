/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cpcProcessorUsage', 'channelUsage'],
    labels: [t('in-forge:plugins.zhmcConsole.cpcProcessorUsage'), t('in-forge:plugins.zhmcConsole.channelUsage')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['powerConsumptionWatts', 'temperatureCelsius'],
    labels: [t('in-forge:plugins.zhmcConsole.powerConsumptionWatts'), t('in-forge:plugins.zhmcConsole.temperature')],
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
      t('in-forge:plugins.zhmcConsole.iip'),
      t('in-forge:plugins.zhmcConsole.ifl'),
      t('in-forge:plugins.zhmcConsole.icf'),
      t('in-forge:plugins.zhmcConsole.cbp'),
      t('in-forge:plugins.zhmcConsole.cp')
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
      t('in-forge:plugins.zhmcConsole.ifl'),
      t('in-forge:plugins.zhmcConsole.icf'),
      t('in-forge:plugins.zhmcConsole.cbp'),
      t('in-forge:plugins.zhmcConsole.cp'),
      t('in-forge:plugins.zhmcConsole.aap')
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
      t('in-forge:plugins.zhmcConsole.ifl'),
      t('in-forge:plugins.zhmcConsole.icf'),
      t('in-forge:plugins.zhmcConsole.cbp'),
      t('in-forge:plugins.zhmcConsole.cp'),
      t('in-forge:plugins.zhmcConsole.aap')
    ],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['envPowerConsumptionWatts', 'heatLoad', 'heatLoadForcedAir', 'heatLoadWater'],
    labels: [
      t('in-forge:plugins.zhmcConsole.powerConsumptionWatts'),
      t('in-forge:plugins.zhmcConsole.heatLoad'),
      t('in-forge:plugins.zhmcConsole.heatLoadForcedAir'),
      t('in-forge:plugins.zhmcConsole.heatLoadWater')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['envTemperatureCelsius', 'dewPointCelsius', 'humidity', 'exhaustTemperatureCelsius'],
    labels: [
      t('in-forge:plugins.zhmcConsole.temperature'),
      t('in-forge:plugins.zhmcConsole.dewPoint'),
      t('in-forge:plugins.zhmcConsole.humidity'),
      t('in-forge:plugins.zhmcConsole.temperature')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['processorUsage', 'networkUsage'],
    labels: ['processorUsage', 'networkUsage'],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['dpmPowerConsumptionWatts', 'dpmTemperatureCelsius'],
    labels: ['Power Consumption', 'Temperature'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['storageUsage', 'acceleratorUsage', 'dpmCryptoUsage'],
    labels: ['storageUsage', 'acceleratorUsage', 'dpmCryptoUsage'],
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
      'dpmCpSharedProcessorUsage',
      'dpmCpAllProcessorUsage',
      'dpmIflSharedProcessorUsage',
      'dpmIflAllProcessorUsage',
      'dpmAllSharedProcessorUsage'
    ],
    min: 0,
    formatter: percentage
  },

  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'processor', t('in-forge:plugins.zhmcConsole.logicalPartition'))
    ],
    labels: [t('in-forge:plugins.zhmcConsole.processorUsage')],
    category: [t('in-forge:plugins.zhmcConsole.logicalPartition')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'zvmPagingRate', t('in-forge:plugins.zhmcConsole.logicalPartition'))
    ],
    labels: [t('in-forge:plugins.zhmcConsole.zvm')],
    category: [t('in-forge:plugins.zhmcConsole.logicalPartition')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('logicalPartition', 'cpProcessorUsage', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch(
        'logicalPartition',
        'iflProcessorUsage',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch(
        'logicalPartition',
        'icfProcessorUsage',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch(
        'logicalPartition',
        'iipProcessorUsage',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch('logicalPartition', 'cbpProcessorUsage', t('in-forge:plugins.zhmcConsole.logicalPartition'))
    ],
    labels: [
      t('in-forge:plugins.zhmcConsole.cp'),
      t('in-forge:plugins.zhmcConsole.ifl'),
      t('in-forge:plugins.zhmcConsole.icf'),
      t('in-forge:plugins.zhmcConsole.iip'),
      t('in-forge:plugins.zhmcConsole.cbp')
    ],
    category: [t('in-forge:plugins.zhmcConsole.logicalPartition')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'macAddress', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'utilization', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'flags', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'networkPortId', t('in-forge:plugins.zhmcConsole.logicalPartition'))
    ],
    labels: [
      t('in-forge:plugins.zhmcConsole.macAddress'),
      t('in-forge:plugins.zhmcConsole.utilization'),
      t('in-forge:plugins.zhmcConsole.flags'),
      t('in-forge:plugins.zhmcConsole.networkPortId')
    ],
    category: [t('in-forge:plugins.zhmcConsole.networkPorts')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'bytesSent', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'bytesReceived', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'intervalBytesSent', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch(
        'networkPorts',
        'intervalBytesReceived',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch('networkPorts', 'bytesPerSecondSent', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch(
        'networkPorts',
        'bytesPerSecondReceived',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      )
    ],
    labels: [
      t('in-forge:plugins.zhmcConsole.bytesSent'),
      t('in-forge:plugins.zhmcConsole.bytesReceived'),
      t('in-forge:plugins.zhmcConsole.intervalBytesSent'),
      t('in-forge:plugins.zhmcConsole.intervalBytesReceived'),
      t('in-forge:plugins.zhmcConsole.bytesPerSecondSent'),
      t('in-forge:plugins.zhmcConsole.bytesPerSecondReceived')
    ],
    category: [t('in-forge:plugins.zhmcConsole.networkPorts')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: [
      getDynamicMetricMatch('networkPorts', 'packetsSent', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'packetsReceived', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch('networkPorts', 'packetsSentDiscarded', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch(
        'networkPorts',
        'packetsReceivedDropped',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch(
        'networkPorts',
        'packetsReceivedDiscarded',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch('networkPorts', 'multicastPacketsSent', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch(
        'networkPorts',
        'multicastPacketsReceived',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      ),
      getDynamicMetricMatch('networkPorts', 'broadcastPacketsSent', t('in-forge:plugins.zhmcConsole.logicalPartition')),
      getDynamicMetricMatch(
        'networkPorts',
        'broadcastPacketsReceived',
        t('in-forge:plugins.zhmcConsole.logicalPartition')
      )
    ],
    labels: [
      t('in-forge:plugins.zhmcConsole.packetsSent'),
      t('in-forge:plugins.zhmcConsole.packetsReceived'),
      t('in-forge:plugins.zhmcConsole.packetsSentDiscarded'),
      t('in-forge:plugins.zhmcConsole.packetsReceivedDropped'),
      t('in-forge:plugins.zhmcConsole.packetsReceivedDiscarded'),
      t('in-forge:plugins.zhmcConsole.multicastPacketsSent'),
      t('in-forge:plugins.zhmcConsole.multicastPacketsReceived'),
      t('in-forge:plugins.zhmcConsole.broadcastPacketsSent'),
      t('in-forge:plugins.zhmcConsole.broadcastPacketsReceived')
    ],
    category: [t('in-forge:plugins.zhmcConsole.networkPorts')],
    min: 0,
    formatter: percentage
  }
];

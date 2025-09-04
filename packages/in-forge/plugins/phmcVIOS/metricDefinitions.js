/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['utilizedProcUnits', 'maxProcUnits', 'entitledProcUnits'],
    labels: [
      t('in-forge:plugins.phmcVIOS.utilizedProcUnits'),
      t('in-forge:plugins.phmcVIOS.maxProcUnits'),
      t('in-forge:plugins.phmcVIOS.entitledProcUnits')
    ],
    min: 0,
    formatter: number.detailed
  },
  {
    metrics: ['entitledProcUnitsPercentage'],
    labels: [t('in-forge:plugins.phmcVIOS.entitledProcUnitsPercentage')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: ['maxCPUCapacityUtilisation'],
    labels: [t('in-forge:plugins.phmcVIOS.maxCpuCapacityUtilisation')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['utilizedMem', 'assignedMem'],
    labels: [t('in-forge:plugins.phmcVIOS.utilizedMem'), t('in-forge:plugins.phmcVIOS.assignedMem')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['utilizedMemPercentage'],
    labels: [t('in-forge:plugins.phmcVIOS.utilizedMemPercentage')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: ['state'],
    labels: [t('in-forge:plugins.phmcVIOS.state')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('genericAdapters', 'sentPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets')),
      getDynamicMetricMatch('genericAdapters', 'receivedPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets')),
      getDynamicMetricMatch('genericAdapters', 'droppedPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets'))
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentPackets'),
      t('in-forge:plugins.phmcVIOS.receivedPackets'),
      t('in-forge:plugins.phmcVIOS.droppedPackets')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.genericAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('genericAdapters', 'sentBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('genericAdapters', 'receivedBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('genericAdapters', 'transferredBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes'))
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentBytes'),
      t('in-forge:plugins.phmcVIOS.receivedBytes'),
      t('in-forge:plugins.phmcVIOS.transferredBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.genericAdapter')],
    min: 0,
    formatter: bytes.compact
  },

  {
    metrics: [
      getDynamicMetricMatch('sharedAdapters', 'sentPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets')),
      getDynamicMetricMatch('sharedAdapters', 'receivedPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets')),
      getDynamicMetricMatch('sharedAdapters', 'droppedPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets'))
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentPackets'),
      t('in-forge:plugins.phmcVIOS.receivedPackets'),
      t('in-forge:plugins.phmcVIOS.droppedPackets')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.sharedAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('sharedAdapters', 'sentBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('sharedAdapters', 'receivedBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('sharedAdapters', 'transferredBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes'))
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentBytes'),
      t('in-forge:plugins.phmcVIOS.receivedBytes'),
      t('in-forge:plugins.phmcVIOS.transferredBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.sharedAdapter')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('virtualEthernetAdapters', 'sentPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets')),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'receivedPackets',
        t('in-forge:plugins.phmcVIOS.dashboard.packets')
      ),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'droppedPackets',
        t('in-forge:plugins.phmcVIOS.dashboard.packets')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentPackets'),
      t('in-forge:plugins.phmcVIOS.receivedPackets'),
      t('in-forge:plugins.phmcVIOS.droppedPackets')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.virtualEthernetAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('virtualEthernetAdapters', 'sentBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('virtualEthernetAdapters', 'receivedBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'transferredBytes',
        t('in-forge:plugins.phmcVIOS.dashboard.bytes')
      ),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'transferredPhysicalBytes',
        t('in-forge:plugins.phmcVIOS.dashboard.bytes')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentBytes'),
      t('in-forge:plugins.phmcVIOS.receivedBytes'),
      t('in-forge:plugins.phmcVIOS.transferredBytes'),
      t('in-forge:plugins.phmcVIOS.transferredPhysicalBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.virtualEthernetAdapter')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('sriovLogicalPorts', 'sentPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets')),
      getDynamicMetricMatch('sriovLogicalPorts', 'receivedPackets', t('in-forge:plugins.phmcVIOS.dashboard.packets'))
    ],
    labels: [t('in-forge:plugins.phmcVIOS.sentPackets'), t('in-forge:plugins.phmcVIOS.receivedPackets')],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.sriovLogicalPort')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('sriovLogicalPorts', 'sentBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('sriovLogicalPorts', 'receivedBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes')),
      getDynamicMetricMatch('sriovLogicalPorts', 'transferredBytes', t('in-forge:plugins.phmcVIOS.dashboard.bytes'))
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.sentBytes'),
      t('in-forge:plugins.phmcVIOS.receivedBytes'),
      t('in-forge:plugins.phmcVIOS.transferredBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.sriovLogicalPort')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'genericPhysicalAdapters',
        'numOfReads',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')
      ),
      getDynamicMetricMatch(
        'genericPhysicalAdapters',
        'numOfWrites',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')
      )
    ],
    labels: [t('in-forge:plugins.phmcVIOS.numOfReads'), t('in-forge:plugins.phmcVIOS.numOfWrites')],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.genericPhysicalAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('genericPhysicalAdapters', 'readBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch('genericPhysicalAdapters', 'writeBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch(
        'genericPhysicalAdapters',
        'transmittedBytes',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.readBytes'),
      t('in-forge:plugins.phmcVIOS.writeBytes'),
      t('in-forge:plugins.phmcVIOS.transmittedBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.genericPhysicalAdapter')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'genericVirtualAdapters',
        'numOfReads',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')
      ),
      getDynamicMetricMatch(
        'genericVirtualAdapters',
        'numOfWrites',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')
      )
    ],
    labels: [t('in-forge:plugins.phmcVIOS.numOfReads'), t('in-forge:plugins.phmcVIOS.numOfWrites')],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.genericVirtualAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('genericVirtualAdapters', 'readBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch('genericVirtualAdapters', 'writeBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch(
        'genericVirtualAdapters',
        'transmittedBytes',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.readBytes'),
      t('in-forge:plugins.phmcVIOS.writeBytes'),
      t('in-forge:plugins.phmcVIOS.transmittedBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.genericVirtualAdapter')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'fiberChannelAdapters',
        'numOfReads',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')
      ),
      getDynamicMetricMatch(
        'fiberChannelAdapters',
        'numOfWrites',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')
      )
    ],
    labels: [t('in-forge:plugins.phmcVIOS.numOfReads'), t('in-forge:plugins.phmcVIOS.numOfWrites')],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.fiberChannelAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('fiberChannelAdapters', 'readBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch('fiberChannelAdapters', 'writeBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch(
        'fiberChannelAdapters',
        'transmittedBytes',
        t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.readBytes'),
      t('in-forge:plugins.phmcVIOS.writeBytes'),
      t('in-forge:plugins.phmcVIOS.transmittedBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.fiberChannelAdapter')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('sharedStoragePools', 'numOfReads', t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite')),
      getDynamicMetricMatch('sharedStoragePools', 'numOfWrites', t('in-forge:plugins.phmcVIOS.dashboard.noOfReadWrite'))
    ],
    labels: [t('in-forge:plugins.phmcVIOS.numOfReads'), t('in-forge:plugins.phmcVIOS.numOfWrites')],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.sharedStoragePool')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('sharedStoragePools', 'readBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch('sharedStoragePools', 'writeBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte')),
      getDynamicMetricMatch('sharedStoragePools', 'transmittedBytes', t('in-forge:plugins.phmcVIOS.dashboard.noOfByte'))
    ],
    labels: [
      t('in-forge:plugins.phmcVIOS.readBytes'),
      t('in-forge:plugins.phmcVIOS.writeBytes'),
      t('in-forge:plugins.phmcVIOS.transmittedBytes')
    ],
    category: [t('in-forge:plugins.phmcVIOS.dashboard.sharedStoragePool')],
    min: 0,
    formatter: bytes.compact
  }
];

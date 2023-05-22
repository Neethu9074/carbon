/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['utilizedProcUnits', 'maxProcUnits', 'entitledProcUnits'],
    labels: [
      t('in-forge:plugins.phmcLPAR.utilizedProcUnits'),
      t('in-forge:plugins.phmcLPAR.maxProcUnits'),
      t('in-forge:plugins.phmcLPAR.entitledProcUnits')
    ],
    min: 0,
    formatter: number.detailed
  },

  {
    metrics: ['entitledProcUnitsPercentage'],
    labels: [t('in-forge:plugins.phmcLPAR.entitledProcUnitsPercentage')],
    min: 0,
    formatter: percentage.detailed
  },
  {
    metrics: ['maxCPUCapacityUtilisation'],
    labels: [t('in-forge:plugins.phmcLPAR.maxCpuCapacityUtilisation')],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['logicalMem', 'backedPhysicalMem', 'totalIOMem', 'mappedIOMem'],
    labels: [
      t('in-forge:plugins.phmcLPAR.logicalMem'),
      t('in-forge:plugins.phmcLPAR.backedPhysicalMem'),
      t('in-forge:plugins.phmcLPAR.totalIOMem'),
      t('in-forge:plugins.phmcLPAR.mappedIOMem')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('virtualEthernetAdapters', 'sentPackets', t('in-forge:plugins.phmcLPAR.dashboard.packets')),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'receivedPackets',
        t('in-forge:plugins.phmcLPAR.dashboard.packets')
      ),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'droppedPackets',
        t('in-forge:plugins.phmcLPAR.dashboard.packets')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcLPAR.sentPackets'),
      t('in-forge:plugins.phmcLPAR.receivedPackets'),
      t('in-forge:plugins.phmcLPAR.droppedPackets')
    ],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.virtualEthernetAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('virtualEthernetAdapters', 'sentBytes', t('in-forge:plugins.phmcLPAR.dashboard.bytes')),
      getDynamicMetricMatch('virtualEthernetAdapters', 'receivedBytes', t('in-forge:plugins.phmcLPAR.dashboard.bytes')),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'transferredBytes',
        t('in-forge:plugins.phmcLPAR.dashboard.bytes')
      ),
      getDynamicMetricMatch(
        'virtualEthernetAdapters',
        'transferredPhysicalBytes',
        t('in-forge:plugins.phmcLPAR.dashboard.bytes')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcLPAR.sentBytes'),
      t('in-forge:plugins.phmcLPAR.receivedBytes'),
      t('in-forge:plugins.phmcLPAR.transferredBytes'),
      t('in-forge:plugins.phmcLPAR.transferredPhysicalBytes')
    ],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.virtualEthernetAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('sriovLogicalPorts', 'sentPackets', t('in-forge:plugins.phmcLPAR.dashboard.packets')),
      getDynamicMetricMatch('sriovLogicalPorts', 'receivedPackets', t('in-forge:plugins.phmcLPAR.dashboard.packets'))
    ],
    labels: [t('in-forge:plugins.phmcLPAR.sentPackets'), t('in-forge:plugins.phmcLPAR.receivedPackets')],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.sriovLogicalPort')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('sriovLogicalPorts', 'sentBytes', t('in-forge:plugins.phmcLPAR.dashboard.bytes')),
      getDynamicMetricMatch('sriovLogicalPorts', 'receivedBytes', t('in-forge:plugins.phmcLPAR.dashboard.bytes')),
      getDynamicMetricMatch('sriovLogicalPorts', 'transferredBytes', t('in-forge:plugins.phmcLPAR.dashboard.bytes'))
    ],
    labels: [
      t('in-forge:plugins.phmcLPAR.sentBytes'),
      t('in-forge:plugins.phmcLPAR.receivedBytes'),
      t('in-forge:plugins.phmcLPAR.transferredBytes')
    ],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.sriovLogicalPort')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'genericVirtualAdapters',
        'numOfReads',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfReadWrite')
      ),
      getDynamicMetricMatch(
        'genericVirtualAdapters',
        'numOfWrites',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfReadWrite')
      )
    ],
    labels: [t('in-forge:plugins.phmcLPAR.numOfReads'), t('in-forge:plugins.phmcLPAR.numOfWrites')],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.genericVirtualAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('genericVirtualAdapters', 'readBytes', t('in-forge:plugins.phmcLPAR.dashboard.noOfByte')),
      getDynamicMetricMatch('genericVirtualAdapters', 'writeBytes', t('in-forge:plugins.phmcLPAR.dashboard.noOfByte')),
      getDynamicMetricMatch(
        'genericVirtualAdapters',
        'transmittedBytes',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfByte')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcLPAR.readBytes'),
      t('in-forge:plugins.phmcLPAR.writeBytes'),
      t('in-forge:plugins.phmcLPAR.transmittedBytes')
    ],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.genericVirtualAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'virtualFiberChannelAdapters',
        'numOfReads',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfReadWrite')
      ),
      getDynamicMetricMatch(
        'virtualFiberChannelAdapters',
        'numOfWrites',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfReadWrite')
      )
    ],
    labels: [t('in-forge:plugins.phmcLPAR.numOfReads'), t('in-forge:plugins.phmcLPAR.numOfWrites')],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.virtualFiberChannelAdapter')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'virtualFiberChannelAdapters',
        'readBytes',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfByte')
      ),
      getDynamicMetricMatch(
        'virtualFiberChannelAdapters',
        'writeBytes',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfByte')
      ),
      getDynamicMetricMatch(
        'virtualFiberChannelAdapters',
        'transmittedBytes',
        t('in-forge:plugins.phmcLPAR.dashboard.noOfByte')
      )
    ],
    labels: [
      t('in-forge:plugins.phmcLPAR.readBytes'),
      t('in-forge:plugins.phmcLPAR.writeBytes'),
      t('in-forge:plugins.phmcLPAR.transmittedBytes')
    ],
    category: [t('in-forge:plugins.phmcLPAR.dashboard.virtualFiberChannelAdapter')],
    min: 0,
    formatter: number
  }
];

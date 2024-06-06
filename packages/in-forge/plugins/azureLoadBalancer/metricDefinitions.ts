/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['byteCount'],
    labels: [t('in-forge:plugins.azureLoadBalancer.labelByteCount')],
    formatter: bytesZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      'vipAvailability',
      'dipAvailability',
      'packetCount',
      'synCount',
      'snatConnectionCount',
      'allocatedSnatPorts',
      'usedSnatPorts'
    ],
    labels: [
      t('in-forge:plugins.azureLoadBalancer.labelVipAvailability'),
      t('in-forge:plugins.azureLoadBalancer.labelDipAvailability'),
      t('in-forge:plugins.azureLoadBalancer.labelPacketCount'),
      t('in-forge:plugins.azureLoadBalancer.labelSYNCount'),
      t('in-forge:plugins.azureLoadBalancer.labelSnatConnectionCount'),
      t('in-forge:plugins.azureLoadBalancer.labelAllocatedSnatPorts'),
      t('in-forge:plugins.azureLoadBalancer.labelUsedSnatPorts')
    ],
    formatter: number.compact,
    min: 0
  }
];

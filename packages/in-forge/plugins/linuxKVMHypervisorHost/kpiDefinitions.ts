/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { percentage, kiloBytesTwoDecimalPlaces, bytesPerSecondZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpuUsage',
    label: t('in-linux-kvm-hypervisor:dashboards.cpuUsage'),
    formatter: percentage.compact
  },
  {
    metric: 'memoryUsageRatio',
    label: t('in-linux-kvm-hypervisor:dashboards.memoryUsage'),
    formatter: percentage.compact
  },
  {
    metric: 'memoryTotal',
    label: t('in-linux-kvm-hypervisor:dashboards.total'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'memoryUsage',
    label: t('in-linux-kvm-hypervisor:dashboards.used'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'memoryFree',
    label: t('in-linux-kvm-hypervisor:dashboards.free'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'bytesRx',
    label: t('in-linux-kvm-hypervisor:dashboards.bytesRX'),
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: 'bytesTx',
    label: t('in-linux-kvm-hypervisor:dashboards.bytesTX'),
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: 'bytesTxRxTotal',
    label: t('in-linux-kvm-hypervisor:dashboards.total'),
    formatter: bytesPerSecondZeroDecimalPlaces
  }
];

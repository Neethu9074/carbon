/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  percentage,
  bytesPerSecondZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpuUsageRatio',
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
  },
  {
    metric: 'networkTxDropCount',
    label: t('in-linux-kvm-hypervisor:dashboards.txDrop'),
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'networkTxErrorCount',
    label: t('in-linux-kvm-hypervisor:dashboards.txError'),
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'networkRxDropCount',
    label: t('in-linux-kvm-hypervisor:dashboards.rxDrop'),
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'networkRxErrorCount',
    label: t('in-linux-kvm-hypervisor:dashboards.rxError'),
    formatter: zeroDecimalPlaces
  }
];

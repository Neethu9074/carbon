/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import {
  number,
  kiloBytesTwoDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces,
  percentage
} from 'in-services/formatters/number';
// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpu_usage',
    label: t('in-xenserver:dashboards.cpuUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'memory',
    label: t('in-xenserver:dashboards.memoryTotal'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metric: 'memory_internal_free',
    label: t('in-xenserver:dashboards.memoryFree'),
    formatter: kiloBytesTwoDecimalPlaces
  },
  {
    metrics: [getDynamicMetricMatch('vif', 'tx'), getDynamicMetricMatch('vif', 'rx')],
    labels: [t('in-xenserver:dashboards.bytesTx'), t('in-xenserver:dashboards.bytesRx')],
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metrics: [getDynamicMetricMatch('vif', 'tx_errors'), getDynamicMetricMatch('vif', 'rx_errors')],
    labels: [t('in-xenserver:dashboards.txErrors'), t('in-xenserver:dashboards.rxErrors')],
    formatter: number.perSecond.detailed
  },
  {
    metrics: [getDynamicMetricMatch('vbd', 'read'), getDynamicMetricMatch('vbd', 'write')],
    labels: [t('in-xenserver:dashboards.vblockDevice.read'), t('in-xenserver:dashboards.vblockDevice.write')],
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metrics: [getDynamicMetricMatch('vbd', 'iops_read'), getDynamicMetricMatch('vbd', 'iops_write')],
    labels: [
      t('in-xenserver:dashboards.vblockDevice.readPerSec'),
      t('in-xenserver:dashboards.vblockDevice.writePerSec')
    ],
    formatter: number.perSecond.detailed
  }
];

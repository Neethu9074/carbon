/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { percentage } from 'in-services/formatters/number';
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
  }
];

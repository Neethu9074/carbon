/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytes, percentage } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.awsEc.labelCPUUtilization'),
    metric: 'cpu_utilization',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.awsEc.titleFreeableMemory'),
    metric: 'freeable_memory',
    formatter: bytes.compact
  }
];

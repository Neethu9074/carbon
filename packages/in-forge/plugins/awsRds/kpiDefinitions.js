/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsRds.cpuUsage'),
    metric: 'cpu_utilization',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.awsRds.availableStorageSpace'),
    metric: 'free_storage_space',
    formatters: bytes.compact
  }
];

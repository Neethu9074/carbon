/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'CpuUsage',
    label: t('in-forge:plugins.aliCloudMysql.cpuUsage'),
    category: [t('in-forge:plugins.aliCloudMysql.cpuUsage')],
    formatter: percentage
  },
  {
    metric: 'MemoryUsage',
    label: t('in-forge:plugins.aliCloudMysql.memoryUsage'),
    category: [t('in-forge:plugins.aliCloudMysql.memoryUsage')],
    formatter: percentage
  },
  {
    metric: 'MySQL_IOPS',
    label: t('in-forge:plugins.aliCloudMysql.mysqlIOPS'),
    category: [t('in-forge:plugins.aliCloudMysql.mysqlIOPS')],
    formatter: number
  }
];

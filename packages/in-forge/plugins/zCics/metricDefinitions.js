/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'CICSplex_Region_Overview.cpu_utilization',
      'CICSplex_Region_Overview.storage_violations',
      'CICSplex_Region_Overview.enqueue_waits',
      'CICSplex_Region_Overview.aids',
      'CICSplex_Region_Overview.ices',
      'CICSplex_Region_Overview.transaction_rate',
      'CICSplex_Region_Overview.maximum_tasks_percent',
      'CICSplex_Region_Overview.cpu_utilization',
      'CICSplex_Region_Overview.io_rate',
      'CICSplex_Region_Overview.page_rate'
    ],
    labels: [
      t('in-forge:plugins.zCics.cpuUtilization'),
      t('in-forge:plugins.zCics.storageViolations'),
      t('in-forge:plugins.zCics.enqueueWaits'),
      t('in-forge:plugins.zCics.aids'),
      t('in-forge:plugins.zCics.ices'),
      t('in-forge:plugins.zCics.transactionRate'),
      t('in-forge:plugins.zCics.maximumTasksPercent'),
      t('in-forge:plugins.zCics.cpuUtilization'),
      t('in-forge:plugins.zCics.ioRate'),
      t('in-forge:plugins.zCics.pageRate')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      'CICSplex_Region_Overview.worst_region_performance_index',
      'CICSplex_Region_Overview.queued_remote_requests'
    ],
    labels: [t('in-forge:plugins.zCics.worstRegionPerformanceIndex'), t('in-forge:plugins.zCics.queuedRemoteRequests')],
    min: 0,
    formatter: bytes
  }
];

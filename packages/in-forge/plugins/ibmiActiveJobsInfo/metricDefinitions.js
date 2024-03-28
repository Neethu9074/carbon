/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, bytes, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch(
        'activeJobsMetrics',
        'threadCount',
        t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.charts.threadCount')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeJobsMetrics',
        'temporaryStorage',
        t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.charts.temporaryStorage')],
    min: 0,
    formatter: bytes,
    category: [t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'activeJobsMetrics',
        'elapsedCPU',
        t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.charts.elapsedCPU')],
    min: 0,
    formatter: percentage,
    category: [t('in-forge:plugins.ibmiActiveJobsInfo.dashboard.tables.activeJobs.name')]
  }
];

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.zCtg.cpuUtilization'),
    metric: 'CICSTG_Region_Overview.cpu_utilization',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCtg.totalRequestsPerMinute'),
    metric: 'CICSTG_Region_Overview.requests_per_minute',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCtg.allocatedConnectionManagerThreads'),
    metric: 'CICSTG_Connection_Manager_Threads.current_number_allocated',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCtg.allocatedWorkerThreads'),
    metric: 'CICSTG_Worker_Threads.current_number_allocated',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCtg.gatewayDaemonHealth'),
    metric: 'CICSTG_Region_Overview.health',
    formatter: number.compact
  }
];

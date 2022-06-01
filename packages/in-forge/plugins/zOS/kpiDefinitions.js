/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { percentagePlainZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.zOS.cpuUsage'),
    metric: 'System_CPU_Utilization.average_cpu_percent',
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.zOS.percentLparMsuCapacity'),
    metric: 'System_CPU_Utilization.percent_lpar_msu_capacity',
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.zOS.averageUnusedGroupMsus'),
    metric: 'System_CPU_Utilization.average_unused_group_msus',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zOS.fourHourMsus'),
    metric: 'System_CPU_Utilization.four_hour_msus',
    formatter: number.compact
  }
];

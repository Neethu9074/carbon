/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.zCics.cpuUtilization'),
    metric: 'CICSplex_Region_Overview.cpu_utilization',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCics.storageViolations'),
    metric: 'CICSplex_Region_Overview.storage_violations',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCics.enqueueWaits'),
    metric: 'CICSplex_Region_Overview.enqueue_waits',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCics.aids'),
    metric: 'CICSplex_Region_Overview.aids',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.zCics.ices'),
    metric: 'CICSplex_Region_Overview.ices',
    formatter: number.compact
  }
];

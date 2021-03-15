/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmDataPowerAppliance.memoryUsage'),
    metric: 'memoryUsage',
    formatter: percentage.compact
  },
  {
    label: t('in-forge:plugins.ibmDataPowerAppliance.cpuUsage'),
    metric: 'cpuUsage',
    formatters: percentage.compact
  }
];

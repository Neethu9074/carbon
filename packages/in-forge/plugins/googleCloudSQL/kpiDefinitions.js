/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.googleCloudSQL.cpuUsage'),
    metric: 'cpu.used',
    formatter: percentageTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.googleCloudSQL.memoryUsage'),
    metric: 'memory.used',
    formatter: percentageTwoDecimalPlaces
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.lxc.memoryUsage', 'Memory Usage'),
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.lxc.cpuSystemUsage', 'CPU System Usage'),
    metric: 'cpu.system_usage',
    formatter: percentageTwoDecimalPlaces
  }
];

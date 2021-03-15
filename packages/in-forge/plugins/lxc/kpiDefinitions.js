/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.lxc.memoryUsage'),
    metric: 'memory.usage',
    formatter: bytesTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.lxc.cpuSystemUsage'),
    metric: 'cpu.system_usage',
    formatter: percentageTwoDecimalPlaces
  }
];

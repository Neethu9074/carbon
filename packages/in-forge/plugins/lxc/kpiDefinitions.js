/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';

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

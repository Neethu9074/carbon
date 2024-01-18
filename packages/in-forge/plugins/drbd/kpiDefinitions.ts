/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.drbd.resourcesNumber'),
    metric: 'resourcesNumber',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.drbd.resourceSuspendedCount'),
    metric: 'resourceSuspendedCount',
    formatter: number.compact
  }
];

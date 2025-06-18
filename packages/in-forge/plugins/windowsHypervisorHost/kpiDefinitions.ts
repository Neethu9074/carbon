/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { kiloBytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cpuUsage',
    label: t('in-windowshypervisor:cpuUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'memoryUsage',
    label: t('in-windowshypervisor:memoryUsage'),
    formatter: percentage.detailed
  },
  {
    metric: 'freeStorageSpace',
    label: t('in-windowshypervisor:dashboards.storageSpaceUsed'),
    formatter: kiloBytesTwoDecimalPlaces
  }
];

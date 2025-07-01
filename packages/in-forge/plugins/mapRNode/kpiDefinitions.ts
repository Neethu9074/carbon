/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.maprNode.cpus'),
    metric: 'metrics.cpus',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.maprNode.disks'),
    metric: 'metrics.disk.disks',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.maprNode.mapRFSDisks'),
    metric: 'metrics.disk.mapRFSDisks',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.maprNode.failedDisks'),
    metric: 'metrics.disk.failedDisks',
    formatter: number.compact
  }
];

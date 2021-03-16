/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesZeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.clrRuntimePlatform.labelAllHeaps'),
    metric: 'mem.all_heaps',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.clrRuntimePlatform.labelTime'),
    metric: 'mem.time_in_gcn',
    formatter: percentage.compact
  }
];

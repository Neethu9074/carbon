/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ping.duration'),
    metric: 'duration',
    formatter: millis.fixedCompact
  },
  {
    label: t('in-forge:plugins.ping.status'),
    metric: 'status',
    formatter: number.compact
  }
];

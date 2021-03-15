/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.endpoint.syntheticCallsPerSecond'),
    metric: 'synthetic_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.endpoint.syntheticErrorRate'),
    metric: 'synthetic_error_rate',
    formatter: percentage.compact
  }
];

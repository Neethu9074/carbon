/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { ms, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.defaultEntity20.allCallsPerSecond'),
    metric: 'count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.defaultEntity20.allCallsAvgLatency'),
    metric: 'duration.mean',
    formatter: ms.compact
  }
];

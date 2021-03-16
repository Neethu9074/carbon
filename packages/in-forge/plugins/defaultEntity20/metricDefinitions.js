/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ms, number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'count',
    label: t('in-forge:plugins.defaultEntity20.allCallsS'),
    category: [t('in-forge:plugins.defaultEntity20.allCalls')],
    min: 0,
    formatter: number
  },
  {
    metric: 'error_count',
    label: t('in-forge:plugins.defaultEntity20.allErroneousCallsS'),
    category: [t('in-forge:plugins.defaultEntity20.allCalls')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['duration.mean', 'duration.min', 'duration.max'],
    labels: [
      t('in-forge:plugins.defaultEntity20.allCallsAvgLatency'),
      t('in-forge:plugins.defaultEntity20.allCallsMinLatency'),
      t('in-forge:plugins.defaultEntity20.allCallsMaxLatency')
    ],
    category: [t('in-forge:plugins.defaultEntity20.allCallsLatency')],
    min: 0,
    formatter: ms
  },
  {
    metrics: ['duration.25th', 'duration.50th', 'duration.75th', 'duration.95th', 'duration.98th', 'duration.99th'],
    labels: [
      t('in-forge:plugins.defaultEntity20.allCallsLatency25th'),
      t('in-forge:plugins.defaultEntity20.allCallsLatency50th'),
      t('in-forge:plugins.defaultEntity20.allCallsLatency75th'),
      t('in-forge:plugins.defaultEntity20.allCallsLatency95th'),
      t('in-forge:plugins.defaultEntity20.allCallsLatency98th'),
      t('in-forge:plugins.defaultEntity20.allCallsLatency99th')
    ],
    category: [t('in-forge:plugins.defaultEntity20.allCallsLatency')],
    min: 0,
    formatter: ms,
    isPercentile: true
  },
  {
    metric: 'error_rate',
    label: t('in-forge:plugins.defaultEntity20.allErroneousCallRate'),
    category: [t('in-forge:plugins.defaultEntity20.allCalls')],
    min: 0,
    formatter: percentage
  }
];

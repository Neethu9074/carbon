/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'created', 'completed', 'failed', 'suspended'
    ],
    labels: [
      t('in-forge:plugins.tibcoBWProcess.created'),
      t('in-forge:plugins.tibcoBWProcess.completed'),
      t('in-forge:plugins.tibcoBWProcess.failed'),
      t('in-forge:plugins.tibcoBWProcess.suspended')
    ],
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.process')],
    formatter: number.compact
  },
  {
    metrics: [
      'totExec', 'avgExec', 'minExec', 'maxExec', 'recntExec',
      'totElap', 'avgElap', 'minElap', 'maxElap', 'recntElap'
    ],
    labels: [
      t('in-forge:plugins.tibcoBWProcess.totExec'),
      t('in-forge:plugins.tibcoBWProcess.avgExec'),
      t('in-forge:plugins.tibcoBWProcess.minExec'),
      t('in-forge:plugins.tibcoBWProcess.maxExec'),
      t('in-forge:plugins.tibcoBWProcess.recntExec'),
      t('in-forge:plugins.tibcoBWProcess.totElap'),
      t('in-forge:plugins.tibcoBWProcess.avgElap'),
      t('in-forge:plugins.tibcoBWProcess.minElap'),
      t('in-forge:plugins.tibcoBWProcess.maxElap'),
      t('in-forge:plugins.tibcoBWProcess.recntElap')
    ],
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.process')],
    formatter: number.short
  },
  {
    metric: getDynamicMetricMatch('activities', 'created', t('in-forge:plugins.tibcoBWProcess.activity')),
    label: t('in-forge:plugins.tibcoBWProcess.created'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('activities', 'faulted', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.faulted'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('activities', 'totExec', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.totExec'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.short
  },
  {
    metric: getDynamicMetricMatch('activities', 'minExec', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.minExec'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.short
  },
  {
    metric: getDynamicMetricMatch('activities', 'maxExec', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.maxExec'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.short
  },
  {
    metric: getDynamicMetricMatch('activities', 'totElap', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.totElap'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.short
  },
  {
    metric: getDynamicMetricMatch('activities', 'minElap', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.minElap'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.short
  },
  {
    metric: getDynamicMetricMatch('activities', 'maxElap', t('in-forge:plugins.tibcoBWProcess.activity')),
    label:  t('in-forge:plugins.tibcoBWProcess.maxElap'),
    min: 0,
    category: [t('in-forge:plugins.tibcoBWProcess.activity')],
    formatter: number.short
  }
];

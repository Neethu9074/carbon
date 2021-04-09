/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch('applications', 'processedEvents', t('in-forge:plugins.mule.application')),
      getDynamicMetricMatch('applications', 'executionErrors', t('in-forge:plugins.mule.application')),
      getDynamicMetricMatch('applications', 'fatalErrors', t('in-forge:plugins.mule.application'))
    ],
    labels: [
      t('in-forge:plugins.mule.processedEvents'),
      t('in-forge:plugins.mule.executionErrors'),
      t('in-forge:plugins.mule.fatalErrors')
    ],
    category: [t('in-forge:plugins.mule.applications')],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      getDynamicMetricMatch('flows', 'processedEvents', t('in-forge:plugins.mule.flow')),
      getDynamicMetricMatch('flows', 'executionErrors', t('in-forge:plugins.mule.flow')),
      getDynamicMetricMatch('flows', 'fatalErrors', t('in-forge:plugins.mule.flow'))
    ],
    labels: [
      t('in-forge:plugins.mule.processedEvents'),
      t('in-forge:plugins.mule.executionErrors'),
      t('in-forge:plugins.mule.fatalErrors')
    ],
    category: [t('in-forge:plugins.mule.flows')],
    min: 0,
    formatter: number
  },
  {
    metrics: [getDynamicMetricMatch('applications', 'avgProcessingTime', t('in-forge:plugins.mule.application'))],
    labels: [t('in-forge:plugins.mule.averageProcessingTime')],
    category: [t('in-forge:plugins.mule.applications')],
    min: 0,
    formatter: millis.fixedCompact
  },
  {
    metrics: [getDynamicMetricMatch('flows', 'avgProcessingTime', t('in-forge:plugins.mule.flow'))],
    labels: [t('in-forge:plugins.mule.averageProcessingTime')],
    category: [t('in-forge:plugins.mule.flows')],
    min: 0,
    formatter: millis.fixedCompact
  }
];

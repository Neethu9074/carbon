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
      getDynamicMetricMatch('applications', 'processedEvents', 'Application'),
      getDynamicMetricMatch('applications', 'executionErrors', 'Application'),
      getDynamicMetricMatch('applications', 'fatalErrors', 'Application')
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
      getDynamicMetricMatch('flows', 'processedEvents', 'Flow'),
      getDynamicMetricMatch('flows', 'executionErrors', 'Flow'),
      getDynamicMetricMatch('flows', 'fatalErrors', 'Flow')
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
    metrics: [getDynamicMetricMatch('applications', 'avgProcessingTime', 'Application')],
    labels: [t('in-forge:plugins.mule.averageProcessingTime')],
    category: [t('in-forge:plugins.mule.applications')],
    min: 0,
    formatter: millis.fixedCompact
  },
  {
    metrics: [getDynamicMetricMatch('flows', 'avgProcessingTime', 'Flow')],
    labels: [t('in-forge:plugins.mule.averageProcessingTime')],
    category: [t('in-forge:plugins.mule.flows')],
    min: 0,
    formatter: millis.fixedCompact
  }
];

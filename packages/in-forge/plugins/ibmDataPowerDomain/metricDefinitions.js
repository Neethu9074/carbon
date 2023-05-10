/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { percentage, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['currentMemUsage'],
    labels: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerDomain.currentMemUsage')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('xmlNames', 'used', t('in-forge:plugins.ibmDataPowerDomain.xmlNameUsed')),
    label: t('in-forge:plugins.ibmDataPowerDomain.xmlNameUsed'),
    category: [t('in-forge:plugins.ibmDataPowerDomain.xmlNames')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'xmlNames',
      'percentFree',
      t('in-forge:plugins.ibmDataPowerDomain.xmlNamePercentFree')
    ),
    label: t('in-forge:plugins.ibmDataPowerDomain.xmlNamePercentFree'),
    category: [t('in-forge:plugins.ibmDataPowerDomain.xmlNames')],
    min: 0,
    formatter: percentage
  }
];

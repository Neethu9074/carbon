/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, percentage, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['currentMemUsage'],
    labels: [t('in-forge:plugins.ibmDataPowerService.currentMemUsage')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerService.currentMemUsage')],
    formatter: percentage
  },
  {
    metrics: ['meanTransactionTime'],
    labels: [t('in-forge:plugins.ibmDataPowerService.meanTransactionTime')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerService.meanTransactionTime')],
    formatter: millis
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.ibmDataPowerService.throughput')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerService.throughput')],
    formatter: number
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['openInputs', 'openOutputs'],
    labels: [t('in-forge:plugins.ibmMqQueueUsage.openInputs'), t('in-forge:plugins.ibmMqQueueUsage.openOutputs')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqQueueUsage.openInputsOutputs')],
    formatter: number
  }
];

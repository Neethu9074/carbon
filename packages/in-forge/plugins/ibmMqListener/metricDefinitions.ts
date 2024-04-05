/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['listenerStatusMetric'],
    labels: [t('in-forge:plugins.ibmMqListener.status')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqListener.status')],
    formatter: number
  }
];

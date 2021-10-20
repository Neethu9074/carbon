/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['numberMessages'],
    labels: [t('in-forge:plugins.ibmMqSubscription.dashboard.count')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqSubscription.numberMessages')],
    formatter: number
  }
];

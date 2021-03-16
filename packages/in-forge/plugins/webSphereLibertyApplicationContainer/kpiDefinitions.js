/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.webSphereLibertyAppContainer.labelActiveThreads'),
    metric: 'threadPool.activeThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.webSphereLibertyAppContainer.labelPoolSize'),
    metric: 'threadPool.poolSize',
    formatter: zeroDecimalPlaces
  }
];

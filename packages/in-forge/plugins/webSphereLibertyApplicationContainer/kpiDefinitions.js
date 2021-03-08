/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

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

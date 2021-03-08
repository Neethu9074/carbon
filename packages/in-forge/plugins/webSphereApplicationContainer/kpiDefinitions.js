/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.webSphereAppContainer.labelActiveThreads'),
    metric: 'threadPools.webContainer.activeThreads',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.webSphereAppContainer.labelPoolSize'),
    metric: 'threadPools.webContainer.poolSize',
    formatter: zeroDecimalPlaces
  }
];

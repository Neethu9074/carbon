/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
  },
  {
    label: t('in-forge:plugins.webSphereAppContainer.labelConcurrentlyHungThreads'),
    metric: 'threadPools.webContainer.concurrentHungThreadCount',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.webSphereAppContainer.labelDeclaredThreadHung'),
    metric: 'threadPools.webContainer.declaredthreadHungCount',
    formatter: zeroDecimalPlaces
  }
];

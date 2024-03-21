/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['resourceSuspended', 'resourceMayPromote', 'resourceForceIOFailures', 'resourcePromotionScore'],
    labels: [
      t('in-forge:plugins.drbdResource.resourceSuspended'),
      t('in-forge:plugins.drbdResource.resourceMayPromote'),
      t('in-forge:plugins.drbdResource.resourceForceIOFailures'),
      t('in-forge:plugins.drbdResource.resourcePromotionScore')
    ],
    min: 0,
    category: [t('in-forge:plugins.drbdResource.drbdResource')],
    formatter: zeroDecimalPlaces
  }
];

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['resourceSuspended', 'resourceMaypromote', 'resourceForceiofailures', 'resourcePromotionscore'],
    labels: [
      t('in-forge:plugins.drbdConnection.resourceSuspended'),
      t('in-forge:plugins.drbdConnection.resourceMaypromote'),
      t('in-forge:plugins.drbdConnection.resourceForceiofailures'),
      t('in-forge:plugins.drbdConnection.resourcePromotionscore')
    ],
    min: 0,
    category: [t('in-forge:plugins.drbdConnection.drbdConnection')],
    formatter: zeroDecimalPlaces
  }
];

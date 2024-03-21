/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['resourcesNumber', 'resourceSuspendedCount'],
    labels: [t('in-forge:plugins.drbdReactor.resourcesNumber'), t('in-forge:plugins.drbdReactor.resourceSuspendedCount')],
    min: 0,
    category: [t('in-forge:plugins.drbdReactor.resourcesNumber')],
    formatter: zeroDecimalPlaces
  }
];

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  zeroDecimalPlaces,
  percentagePlainZeroDecimalPlaces,
  timeByMillisZeroDecimalPlaces
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['availability'],
    labels: [t('in-forge:plugins.azureManagedHSM.labelAvailability')],
    formatter: percentagePlainZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serviceApiLatency'],
    labels: [t('in-forge:plugins.azureManagedHSM.labelServiceApiLatency')],
    formatter: timeByMillisZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serviceApiHit'],
    labels: [t('in-forge:plugins.azureManagedHSM.labelServiceApiHit')],
    formatter: zeroDecimalPlaces,
    min: 0
  }
];

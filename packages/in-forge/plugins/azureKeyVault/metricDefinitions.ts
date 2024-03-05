/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  zeroDecimalPlaces,
  percentagePlainZeroDecimalPlaces,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['availability'],
    labels: [t('in-forge:plugins.azureKeyVault.labelAvailability')],
    category: [t('in-forge:plugins.azureKeyVault.vaultCategory')],
    formatter: percentagePlainZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serviceApiLatency'],
    labels: [t('in-forge:plugins.azureKeyVault.labelServiceApiLatency')],
    category: [t('in-forge:plugins.azureKeyVault.serviceApiCategory')],
    formatter: timeByMillisTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: ['saturationShoebox'],
    labels: [t('in-forge:plugins.azureKeyVault.labelSaturationShoeBox')],
    category: [t('in-forge:plugins.azureKeyVault.vaultCategory')],
    formatter: percentagePlainZeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serviceApiHit'],
    labels: [t('in-forge:plugins.azureKeyVault.labelServiceApiHit')],
    category: [t('in-forge:plugins.azureKeyVault.serviceApiCategory')],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: ['serviceApiResult'],
    labels: [t('in-forge:plugins.azureKeyVault.labelServiceApiResult')],
    category: [t('in-forge:plugins.azureKeyVault.serviceApiCategory')],
    formatter: zeroDecimalPlaces,
    min: 0
  }
];

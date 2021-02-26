/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'tr_to',
    label: t('in-forge:plugins.azureStorage.labelTrTo'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },

  {
    metric: 'in_to',
    label: t('in-forge:plugins.azureStorage.labelInTo'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_av',
    label: t('in-forge:plugins.azureStorage.labelInAv'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_mi',
    label: t('in-forge:plugins.azureStorage.labelInMi'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_mx',
    label: t('in-forge:plugins.azureStorage.labelInMx'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },

  {
    metric: 'eg_to',
    label: t('in-forge:plugins.azureStorage.labelEgTo'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_av',
    label: t('in-forge:plugins.azureStorage.labelEgAv'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_mi',
    label: t('in-forge:plugins.azureStorage.labelEgMi'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_mx',
    label: t('in-forge:plugins.azureStorage.labelEgMx'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },

  {
    metric: 'sl_to',
    label: t('in-forge:plugins.azureStorage.labelSlTo'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_av',
    label: t('in-forge:plugins.azureStorage.labelSlAv'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_mi',
    label: t('in-forge:plugins.azureStorage.labelSlMi'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_mx',
    label: t('in-forge:plugins.azureStorage.labelSlMx'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },

  {
    metric: 'el_to',
    label: t('in-forge:plugins.azureStorage.labelElTo'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_av',
    label: t('in-forge:plugins.azureStorage.labelElAv'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_mi',
    label: t('in-forge:plugins.azureStorage.labelElMi'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_mx',
    label: t('in-forge:plugins.azureStorage.labelElMx'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },

  {
    metric: 'av_to',
    label: t('in-forge:plugins.azureStorage.labelAvTo'),
    category: ['Availability'],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_av',
    label: t('in-forge:plugins.azureStorage.labelAvAv'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_mi',
    label: t('in-forge:plugins.azureStorage.labelAvMi'),
    category: ['Latency'],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_mx',
    label: t('in-forge:plugins.azureStorage.labelAvMx'),
    category: ['Latency'],
    min: 0,
    formatter: number
  }
];

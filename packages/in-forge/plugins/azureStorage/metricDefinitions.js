/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'tr_to',
    label: t('in-forge:plugins.azureStorage.labelTrTo'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },

  {
    metric: 'in_to',
    label: t('in-forge:plugins.azureStorage.labelInTo'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_av',
    label: t('in-forge:plugins.azureStorage.labelInAv'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_mi',
    label: t('in-forge:plugins.azureStorage.labelInMi'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'in_mx',
    label: t('in-forge:plugins.azureStorage.labelInMx'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },

  {
    metric: 'eg_to',
    label: t('in-forge:plugins.azureStorage.labelEgTo'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_av',
    label: t('in-forge:plugins.azureStorage.labelEgAv'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_mi',
    label: t('in-forge:plugins.azureStorage.labelEgMi'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'eg_mx',
    label: t('in-forge:plugins.azureStorage.labelEgMx'),
    category: [t('in-forge:plugins.azureStorage.traffic')],
    min: 0,
    formatter: number
  },

  {
    metric: 'sl_to',
    label: t('in-forge:plugins.azureStorage.labelSlTo'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_av',
    label: t('in-forge:plugins.azureStorage.labelSlAv'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_mi',
    label: t('in-forge:plugins.azureStorage.labelSlMi'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'sl_mx',
    label: t('in-forge:plugins.azureStorage.labelSlMx'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },

  {
    metric: 'el_to',
    label: t('in-forge:plugins.azureStorage.labelElTo'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_av',
    label: t('in-forge:plugins.azureStorage.labelElAv'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_mi',
    label: t('in-forge:plugins.azureStorage.labelElMi'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'el_mx',
    label: t('in-forge:plugins.azureStorage.labelElMx'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },

  {
    metric: 'av_to',
    label: t('in-forge:plugins.azureStorage.labelAvTo'),
    category: [t('in-forge:plugins.azureStorage.availability')],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_av',
    label: t('in-forge:plugins.azureStorage.labelAvAv'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_mi',
    label: t('in-forge:plugins.azureStorage.labelAvMi'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },
  {
    metric: 'av_mx',
    label: t('in-forge:plugins.azureStorage.labelAvMx'),
    category: [t('in-forge:plugins.azureStorage.latency')],
    min: 0,
    formatter: number
  },

  {
    metric: 'qcap_av',
    label: t('in-forge:plugins.azureStorage.labelQuCa'),
    category: [t('in-forge:plugins.azureStorage.dashboard.titleQueueCapacity')],
    min: 0,
    formatter: number
  },
  {
    metric: 'qc_av',
    label: t('in-forge:plugins.azureStorage.labelQuCo'),
    category: [t('in-forge:plugins.azureStorage.dashboard.titleQueueCount')],
    min: 0,
    formatter: number
  },
  {
    metric: 'qms_av',
    label: t('in-forge:plugins.azureStorage.labelQuMeCo'),
    category: [t('in-forge:plugins.azureStorage.dashboard.titleQueueMessageCount')],
    min: 0,
    formatter: number
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'art',
    label: t('in-forge:plugins.azureAppService.labelArt'),
    category: [t('in-forge:plugins.azureAppService.performance')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2x',
    label: t('in-forge:plugins.azureAppService.labelH2x'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4x',
    label: t('in-forge:plugins.azureAppService.labelH4x'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5x',
    label: t('in-forge:plugins.azureAppService.labelH5x'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'trs',
    label: t('in-forge:plugins.azureAppService.labelTrs'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    formatter: number
  },
  {
    metric: 'qrs',
    label: t('in-forge:plugins.azureAppService.labelQrs'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'bts',
    label: t('in-forge:plugins.azureAppService.labelBts'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'btr',
    label: t('in-forge:plugins.azureAppService.labelBtr'),
    category: [t('in-forge:plugins.azureAppService.traffic')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c',
    label: t('in-forge:plugins.azureAppService.labelG0c'),
    category: [t('in-forge:plugins.azureAppService.runtime')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c',
    label: t('in-forge:plugins.azureAppService.labelG1c'),
    category: [t('in-forge:plugins.azureAppService.runtime')],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c',
    label: t('in-forge:plugins.azureAppService.labelG2c'),
    category: [t('in-forge:plugins.azureAppService.runtime')],
    min: 0,
    formatter: number
  }
];

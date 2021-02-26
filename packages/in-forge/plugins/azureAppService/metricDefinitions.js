/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'art',
    label: t('in-forge:plugins.azureAppService.labelArt'),
    category: ['Performance'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h2x',
    label: t('in-forge:plugins.azureAppService.labelH2x'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h4x',
    label: t('in-forge:plugins.azureAppService.labelH4x'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'h5x',
    label: t('in-forge:plugins.azureAppService.labelH5x'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'trs',
    label: t('in-forge:plugins.azureAppService.labelTrs'),
    category: ['Traffic'],
    formatter: number
  },
  {
    metric: 'qrs',
    label: t('in-forge:plugins.azureAppService.labelQrs'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'bts',
    label: t('in-forge:plugins.azureAppService.labelBts'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'btr',
    label: t('in-forge:plugins.azureAppService.labelBtr'),
    category: ['Traffic'],
    min: 0,
    formatter: number
  },
  {
    metric: 'g0c',
    label: t('in-forge:plugins.azureAppService.labelG0c'),
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'g1c',
    label: t('in-forge:plugins.azureAppService.labelG1c'),
    category: ['Runtime'],
    min: 0,
    formatter: number
  },
  {
    metric: 'g2c',
    label: t('in-forge:plugins.azureAppService.labelG2c'),
    category: ['Runtime'],
    min: 0,
    formatter: number
  }
];

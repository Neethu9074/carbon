/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { zeroDecimalPlaces, number, twoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'avgResTime',
      'countLessHalf',
      'countHalfAndOneHalf',
      'countOneHalfAndThree',
      'countThreeAndFive',
      'countGreaterFive'
    ],
    labels: [
      t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime'),
      t('in-forge:plugins.tuxedoAppTuxedoService.countLessHalf'),
      t('in-forge:plugins.tuxedoAppTuxedoService.countHalfAndOneHalf'),
      t('in-forge:plugins.tuxedoAppTuxedoService.countOneHalfAndThree'),
      t('in-forge:plugins.tuxedoAppTuxedoService.countThreeAndFive'),
      t('in-forge:plugins.tuxedoAppTuxedoService.countGreaterFive')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['throughput'],
    labels: [t('in-forge:plugins.tuxedoAppTuxedoService.throughput')],
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: twoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'avgResTime',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.avgResTime'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'throughput',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.throughput'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: twoDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'countLessHalf',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.countLessHalf'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'countHalfAndOneHalf',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.countHalfAndOneHalf'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'countOneHalfAndThree',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.countOneHalfAndThree'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'countThreeAndFive',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.countThreeAndFive'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch(
      'servers',
      'countGreaterFive',
      t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')
    ),
    label: t('in-forge:plugins.tuxedoAppTuxedoService.countGreaterFive'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoAppTuxedoService.tuxedoAppTuxedoService')],
    formatter: number
  }
];

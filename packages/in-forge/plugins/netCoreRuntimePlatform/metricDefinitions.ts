/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.gcCount', 'metrics.exceptionThrownCount', 'metrics.contentionCount'],
    labels: [
      t('in-forge:plugins.netCoreRuntimePlatform.gcCount'),
      t('in-forge:plugins.netCoreRuntimePlatform.exceptionsThrown'),
      t('in-forge:plugins.netCoreRuntimePlatform.contentionCount')
    ],
    min: 0,
    category: [t('in-forge:plugins.netCoreRuntimePlatform.counters')],
    formatter: number
  },
  {
    metrics: ['metrics.heapSizeGen0', 'metrics.heapSizeGen1', 'metrics.heapSizeGen2', 'metrics.heapSizeGen3'],
    labels: ['Generation 0', 'Generation 1', 'Generation 2', 'Generation 3'],
    min: 0,
    category: [t('in-forge:plugins.netCoreRuntimePlatform.memory')],
    formatter: number
  }
];

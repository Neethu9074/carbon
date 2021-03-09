/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['gc.hs', 'gc.fb', 'gc.ub'],
    labels: [
      t('in-forge:plugins.crystalRuntimePlatform.size'),
      t('in-forge:plugins.crystalRuntimePlatform.free'),
      t('in-forge:plugins.crystalRuntimePlatform.unused')
    ],
    min: 0,
    category: [t('in-forge:plugins.crystalRuntimePlatform.heap')],
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['gc.bsgc'],
    labels: [t('in-forge:plugins.crystalRuntimePlatform.bytesSinceGc')],
    min: 0,
    category: [t('in-forge:plugins.crystalRuntimePlatform.gc')],
    formatter: bytesZeroDecimalPlaces
  }
];

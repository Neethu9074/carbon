/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.crystalRuntimePlatform.heapSize'),
    metric: 'gc.hs',
    formatter: bytesZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.crystalRuntimePlatform.bytesSinceGc'),
    metric: 'gc.bsgc',
    formatter: bytesZeroDecimalPlaces
  }
];

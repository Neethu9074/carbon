/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesTwoDecimalPlaces, timeNs } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.golangRuntimePlatform.gcPause'),
    metric: 'metrics.memory.pause_ns',
    formatter: timeNs
  },
  {
    label: t('in-forge:plugins.golangRuntimePlatform.usedHeap'),
    metric: 'metrics.memory.heap_in_use',
    formatter: bytesTwoDecimalPlaces
  }
];

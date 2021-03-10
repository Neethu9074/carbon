/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.instanaAgent.cpuLoad'),
    metric: 'cpu.load',
    formatter: number.detailed
  },
  {
    label: t('in-forge:plugins.instanaAgent.memoryUsed'),
    metric: 'memory.used',
    formatter: bytesZeroDecimalPlaces
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.hadoopYARNNode.runningContainers'),
    metric: 'runningContainers',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.hadoopYARNNode.availableMemory'),
    metric: 'availableMem',
    formatter: bytes.detailed
  }
];

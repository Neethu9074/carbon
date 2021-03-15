/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['allocatedVCores', 'availableVCores'],
    labels: [
      t('in-forge:plugins.hadoopYARNNode.allocatedVirtualCores'),
      t('in-forge:plugins.hadoopYARNNode.availableVirtualCores')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['allocatedMem', 'availableMem'],
    labels: [
      t('in-forge:plugins.hadoopYARNNode.allocatedMemory'),
      t('in-forge:plugins.hadoopYARNNode.availableMemory')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['allocatedMem', 'availableMem'],
    labels: [
      t('in-forge:plugins.hadoopYARNNode.allocatedMemory'),
      t('in-forge:plugins.hadoopYARNNode.availableMemory')
    ],
    min: 0,
    formatter: bytes
  }
];

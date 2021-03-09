/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number, micros } from 'in-services/formatters/number';

export default [
  {
    metrics: ['totalCpuTime', 'maxCpuTime', 'minCpuTime'],
    labels: [
      t('in-forge:plugins.aceFlowNode.totalCpuTime'),
      t('in-forge:plugins.aceFlowNode.maxCpuTime'),
      t('in-forge:plugins.aceFlowNode.minCpuTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceFlowNode.cpuTime')],
    formatter: micros
  },
  {
    metrics: ['totalElapsedTime', 'maxElapsedTime', 'minElapsedTime'],
    labels: [
      t('in-forge:plugins.aceFlowNode.totalElapsedTime'),
      t('in-forge:plugins.aceFlowNode.maxElapsedTime'),
      t('in-forge:plugins.aceFlowNode.minElapsedTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceFlowNode.elapsedTime')],
    formatter: micros
  },
  {
    metrics: ['invocations'],
    labels: [t('in-forge:plugins.aceFlowNode.invocations')],
    min: 0,
    category: [t('in-forge:plugins.aceFlowNode.invocations')],
    formatter: number
  },
  {
    metrics: ['inputTerminals', 'outputTerminals'],
    labels: [t('in-forge:plugins.aceFlowNode.inputTerminals'), t('in-forge:plugins.aceFlowNode.outputTerminals')],
    min: 0,
    category: [t('in-forge:plugins.aceFlowNode.terminals')],
    formatter: number
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, micros, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['totalElapsedTime', 'maxElapsedTime', 'minElapsedTime'],
    labels: [
      t('in-forge:plugins.aceMessageFlow.totalElapsedTime'),
      t('in-forge:plugins.aceMessageFlow.maxElapsedTime'),
      t('in-forge:plugins.aceMessageFlow.minElapsedTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.elapsedTime')],
    formatter: micros
  },
  {
    metrics: ['elapsedTimeWaitingForInputMsgs'],
    labels: [t('in-forge:plugins.aceMessageFlow.elapsedTimeWaitingForInputMsgs')],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.elapsedTimeWaitingForInputMsgs')],
    formatter: micros
  },
  {
    metrics: ['totalSizeOfInputMsgs', 'maxSizeOfInputMsgs', 'minSizeOfInputMsgs'],
    labels: [
      t('in-forge:plugins.aceMessageFlow.totalSizeOfInputMsgs'),
      t('in-forge:plugins.aceMessageFlow.maxSizeOfInputMsgs'),
      t('in-forge:plugins.aceMessageFlow.minSizeOfInputMsgs')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.sizeOfInputMsgs')],
    formatter: bytes
  },
  {
    metrics: ['totalInputMsgs'],
    labels: [t('in-forge:plugins.aceMessageFlow.totalInputMsgs')],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.sizeOfInputMsgs')],
    formatter: number
  },
  {
    metrics: ['totalCpuTime', 'maxCpuTime', 'minCpuTime'],
    labels: [
      t('in-forge:plugins.aceMessageFlow.totalCpuTime'),
      t('in-forge:plugins.aceMessageFlow.maxCpuTime'),
      t('in-forge:plugins.aceMessageFlow.minCpuTime')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.cpuTime')],
    formatter: micros
  },
  {
    metrics: ['cpuTimeWaitingForInputMsgs'],
    labels: [t('in-forge:plugins.aceMessageFlow.cpuTimeWaitingForInputMsgs')],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.cpuTimeWaitingForInputMsgs')],
    formatter: micros
  },
  {
    metrics: ['threadsInPool', 'timesMaxNumberOfThreadsReached'],
    labels: [t('in-forge:plugins.aceMessageFlow.threadsInPool'), t('in-forge:plugins.aceMessageFlow.threadsInPool')],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.threads')],
    formatter: number
  },
  {
    metrics: ['mqErrors', 'msgWithErrors', 'processingMsgErrors', 'timeOutsWaitingForRepliesToAggregateMsgs'],
    labels: [
      t('in-forge:plugins.aceMessageFlow.mqErrors'),
      t('in-forge:plugins.aceMessageFlow.msgWithErrors'),
      t('in-forge:plugins.aceMessageFlow.processingMsgErrors'),
      t('in-forge:plugins.aceMessageFlow.timeOutsWaitingForRepliesToAggregateMsgs')
    ],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.timeOutAndErrors')],
    formatter: number
  },
  {
    metrics: ['commits', 'backouts'],
    labels: [t('in-forge:plugins.aceMessageFlow.commits'), t('in-forge:plugins.aceMessageFlow.backouts')],
    min: 0,
    category: [t('in-forge:plugins.aceMessageFlow.commitsAndBackouts')],
    formatter: number
  }
];

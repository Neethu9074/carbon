/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cbytes'],
    labels: [t('in-forge:plugins.tuxedoIpcQueue.usedBytes')],
    min: 0,
    category: [t('in-forge:plugins.tuxedoIpcQueue.ipcQueues')],
    formatter: bytes.detailed
  },
  {
    metrics: ['qnum', 'usage'],
    labels: [t('in-forge:plugins.tuxedoIpcQueue.messages'), t('in-forge:plugins.tuxedoIpcQueue.usage')],
    min: 0,
    category: [t('in-forge:plugins.tuxedoIpcQueue.ipcQueues')],
    formatter: number
  }
];

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { zeroDecimalPlaces, number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'totalQnum',
      'wkInitiated',
      'wkCompleted',
      'curAccessers',
      'numEnqueue',
      'numDequeue',
      'currLoad',
      'hwAccessers',
      'numReq',
      'stateMetric'
    ],
    labels: [
      t('in-forge:plugins.tuxedoMachine.totNumOfIPCMsgs'),
      t('in-forge:plugins.tuxedoMachine.initiated'),
      t('in-forge:plugins.tuxedoMachine.completed'),
      t('in-forge:plugins.tuxedoMachine.curAccessers'),
      t('in-forge:plugins.tuxedoMachine.enqueue'),
      t('in-forge:plugins.tuxedoMachine.dequeue'),
      t('in-forge:plugins.tuxedoMachine.curLoad'),
      t('in-forge:plugins.tuxedoMachine.highNoOfAccessors'),
      t('in-forge:plugins.tuxedoMachine.numReq'),
      t('in-forge:plugins.tuxedoMachine.stateMetric')
    ],
    min: 0,
    category: [t('in-forge:plugins.tuxedoMachine.machines')],
    formatter: zeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('ipcQueues', 'cbytes', t('in-forge:plugins.tuxedoMachine.ipcQueueId')),
    label: t('in-forge:plugins.tuxedoMachine.usedBytes'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoMachine.ipcQueues')],
    formatter: bytes.detailed
  },
  {
    metric: getDynamicMetricMatch('ipcQueues', 'qnum', t('in-forge:plugins.tuxedoMachine.ipcQueueId')),
    label: t('in-forge:plugins.tuxedoMachine.messages'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoMachine.ipcQueues')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('ipcQueues', 'usage', t('in-forge:plugins.tuxedoMachine.ipcQueueId')),
    label: t('in-forge:plugins.tuxedoMachine.usage'),
    min: 0,
    category: [t('in-forge:plugins.tuxedoMachine.ipcQueues')],
    formatter: number
  }
];

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['preFilterInserts', 'preFilterUpdates', 'preFilterDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterInserts'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterUpdates'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterDeletes')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['postFilterInserts', 'postFilterUpdates', 'postFilterDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterInserts'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterUpdates'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterDeletes')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['logSourceDBProcessed', 'logPhysicalBytesRead'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.databaseBytesProcessed'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.physicalBytesRead')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['logThreadCpu'],
    labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.threadCpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['logParserDiskWrite', 'logParserDiskRead', 'logParserDiskSize'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.diskWrites'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.diskReads'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.diskSize')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['targetApplyInserts', 'targetApplyUpdates', 'targetApplyDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyInserts'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyUpdates'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyDeletes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['targetEngineInserts', 'targetEngineUpdates', 'targetEngineDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineInserts'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineUpdates'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineDeletes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['sourceLatency', 'targetLatency'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngineLatency'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyLatency')
    ],
    min: 0,
    formatter: number
  }
];

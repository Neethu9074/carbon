/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number, seconds, bytes, millis } from 'in-services/formatters/number';
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
    formatter: bytes.compact
  },
  {
    metrics: ['logParserDiskWrite', 'logParserDiskRead', 'logParserDiskSize'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.diskWrites'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.diskReads'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.diskSize')
    ],
    min: 0,
    formatter: bytes.compact
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
    formatter: seconds.fixedCompact
  },
  {
    metrics: ['sourceNetworkLatency', 'targetNetworkLatency'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceNetwork'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetNetwork')
    ],
    min: 0,
    formatter: millis.compact
  },
  {
    metrics: ['sourceRowsDerivedCols', 'sourceRowsCallingSource', 'sourceRowsUserExits'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsEvaluatingDerivedCols'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingSourceDatabase'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingUserExitsSource')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['targetRowsExpressions', 'targetRowsCallingTarget', 'targetRowsUserExits'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsEvaluatingExpressions'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingTargetDatabase'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingUserExitsTarget')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['sourceMbcs', 'targetMbcs'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngineMbcs'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineMbcs')
    ],
    min: 0,
    formatter: bytes.compact
  },
  {
    metrics: [
      'sourceEngineThreadCpu',
      'targetEngineThreadCpu',
      'logThreadCpu',
      'targetApplyThreadCpu',
      'logParserThreadCpu'
    ],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngineThreadCpu'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineThreadCpu'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.logReaderThreadCpu'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyThreadCpu'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.logParserThreadCpu')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['sourceMissResponse', 'keepAliveSent', 'commByteSent'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceMissingRoundTripResponse'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.keepAliveSent'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.bytesSent')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['targetMissResponse', 'keepAliveReceived', 'commByteSent'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetMissingRoundTripResponse'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.keepAliveReceived'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.bytesReceived')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['commSourceBytes', 'commTargetBytes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceCommunicationsBytesProcessed'),
      t('in-forge:plugins.ibmInfosphereCdcSubscription.targetCommunicationsBytesProcessed')
    ],
    min: 0,
    formatter: bytes.compact
  }
];

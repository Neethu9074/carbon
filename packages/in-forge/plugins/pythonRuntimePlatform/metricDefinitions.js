/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['metrics.ru_utime', 'metrics.ru_stime'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.timeSpentInUserMode'),
      t('in-forge:plugins.pythonRuntimePlatform.timeSpentInSystemMode')
    ],
    min: 0,
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    metrics: ['metrics.ru_ixrss', 'metrics.ru_idrss', 'metrics.ru_maxrss', 'metrics.ru_isrss'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.sharedMemorySize'),
      t('in-forge:plugins.pythonRuntimePlatform.unsharedMemorySize'),
      t('in-forge:plugins.pythonRuntimePlatform.maximumResidentSetSize'),
      t('in-forge:plugins.pythonRuntimePlatform.unshareStackSize')
    ],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['metrics.ru_minflt', 'metrics.ru_majflt', 'metrics.ru_nswap'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.pageFaultsRequiringIO'),
      t('in-forge:plugins.pythonRuntimePlatform.pageFaultsNotRequiringIO'),
      t('in-forge:plugins.pythonRuntimePlatform.swapOuts')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.ru_inblock', 'metrics.ru_oublock'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.blockInputOperations'),
      t('in-forge:plugins.pythonRuntimePlatform.blockOutputOperations')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.ru_msgsnd', 'metrics.ru_msgrcv', 'metrics.ru_nsignals'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.messagesSent'),
      t('in-forge:plugins.pythonRuntimePlatform.messagesReceived'),
      t('in-forge:plugins.pythonRuntimePlatform.signalsReceived')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.ru_nvcsw', 'metrics.ru_nivcsw'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.voluntaryContextSwitches'),
      t('in-forge:plugins.pythonRuntimePlatform.involuntaryContextSwitches')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'metrics.rgc.collect0',
      'metrics.rgc.collect1',
      'metrics.rgc.collect2',
      'metrics.rgc.threshold0',
      'metrics.rgc.threshold1',
      'metrics.rgc.threshold2'
    ],
    labels: ['Collect 0', 'Collect 1', 'Collect 2', 'Threshold 0', 'Threshold 1', 'Threshold 2'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.alive_threads', 'metrics.dummy_threads', 'metrics.daemon_threads'],
    labels: [
      t('in-forge:plugins.pythonRuntimePlatform.aliveThreads'),
      t('in-forge:plugins.pythonRuntimePlatform.dummyThreads'),
      t('in-forge:plugins.pythonRuntimePlatform.daemonThreads')
    ],
    min: 0,
    formatter: number
  }
];

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
      t('in-forge:plugins.ibmInfosphereSubscription.preFilterInserts'),
      t('in-forge:plugins.ibmInfosphereSubscription.preFilterUpdates'),
      t('in-forge:plugins.ibmInfosphereSubscription.preFilterDeletes')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['postFilterInserts', 'postFilterUpdates', 'postFilterDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereSubscription.postFilterInserts'),
      t('in-forge:plugins.ibmInfosphereSubscription.postFilterUpdates'),
      t('in-forge:plugins.ibmInfosphereSubscription.postFilterDeletes')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['databaseBytesProcessed', 'physicalBytesRead'],
    labels: [
      t('in-forge:plugins.ibmInfosphereSubscription.databaseBytesProcessed'),
      t('in-forge:plugins.ibmInfosphereSubscription.physicalBytesRead')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['threadCpu'],
    labels: [t('in-forge:plugins.ibmInfosphereSubscription.threadCpu')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['diskWrites', 'diskReads', 'diskSize'],
    labels: [
      t('in-forge:plugins.ibmInfosphereSubscription.diskWrites'),
      t('in-forge:plugins.ibmInfosphereSubscription.diskReads'),
      t('in-forge:plugins.ibmInfosphereSubscription.diskSize')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['applyInserts', 'applyUpdates', 'applyDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereSubscription.applyInserts'),
      t('in-forge:plugins.ibmInfosphereSubscription.applyUpdates'),
      t('in-forge:plugins.ibmInfosphereSubscription.applyDeletes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['targetSourceInserts', 'targetSourceUpdates', 'targetSourceDeletes'],
    labels: [
      t('in-forge:plugins.ibmInfosphereSubscription.targetSourceInserts'),
      t('in-forge:plugins.ibmInfosphereSubscription.targetSourceUpdates'),
      t('in-forge:plugins.ibmInfosphereSubscription.targetSourceDeletes')
    ],
    min: 0,
    formatter: number
  }
];

/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['currentTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.currentTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transferStatistics')],
    formatter: number
  },
  {
    metrics: ['totalTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.totalTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transferStatistics')],
    formatter: number
  },
  {
    metrics: ['failedTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.failedTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transferStatistics')],
    formatter: number
  },
  {
    metrics: ['successfulTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.successfulTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transferStatistics')],
    formatter: number
  },
  {
    metrics: ['partiallySuccessfulTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.partiallySuccessfulTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftCoordiQmgr.dashboard.transferStatistics')],
    formatter: number
  }
];

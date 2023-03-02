/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['runningTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftAgent.dashboard.runningTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftAgent.agent')],
    formatter: number
  },
  {
    metrics: ['totalCurrentTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftAgent.dashboard.totalCurrentTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftAgent.agent')],
    formatter: number
  },
  {
    metrics: ['totalSourceTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftAgent.dashboard.totalSourceTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftAgent.agent')],
    formatter: number
  },
  {
    metrics: ['totalDestinationTransfers'],
    labels: [t('in-forge:plugins.ibmMqMftAgent.dashboard.totalDestinationTransfers')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftAgent.agent')],
    formatter: number
  }
];

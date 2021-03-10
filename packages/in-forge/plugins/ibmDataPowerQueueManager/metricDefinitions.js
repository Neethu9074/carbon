/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['backendActiveConnections'],
    labels: [t('in-forge:plugins.ibmDataPowerQueueManager.backendActiveConnections')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerQueueManager.backendActiveConnections')],
    formatter: number
  },
  {
    metrics: ['frontendActiveConnections'],
    labels: [t('in-forge:plugins.ibmDataPowerQueueManager.frontendActiveConnections')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerQueueManager.frontendActiveConnections')],
    formatter: number
  }
];

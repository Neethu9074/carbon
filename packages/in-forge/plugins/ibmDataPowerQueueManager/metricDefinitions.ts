/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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

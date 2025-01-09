/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['backendActiveConversations'],
    labels: [t('in-forge:plugins.ibmDataPowerQueueManagerV9.backendActiveConversations')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerQueueManagerV9.backendActiveConversations')],
    formatter: number
  },
  {
    metrics: ['frontendActiveConversations'],
    labels: [t('in-forge:plugins.ibmDataPowerQueueManagerV9.frontendActiveConversations')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerQueueManagerV9.frontendActiveConversations')],
    formatter: number
  }
];

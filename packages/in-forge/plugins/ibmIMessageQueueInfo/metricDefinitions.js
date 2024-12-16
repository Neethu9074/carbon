/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      getDynamicMetricMatch(
        'messageQueueMetrics',
        'severity',
        t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.severity')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.name')]
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'messageQueueMetrics',
        'messageType',
        t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.name')
      )
    ],
    labels: [t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.messageType')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.ibmIMessageQueueInfo.dashboard.tables.messageQueue.name')]
  }
];

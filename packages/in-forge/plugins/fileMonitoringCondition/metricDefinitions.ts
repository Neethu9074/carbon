/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['issueTriggered'],
    labels: [t('in-forge:plugins.fileMonitoringCondition.issueTriggered')],
    min: 0,
    formatter: number,
    category: [t('in-forge:plugins.fileMonitoringCondition.issueTriggered')]
  }
];

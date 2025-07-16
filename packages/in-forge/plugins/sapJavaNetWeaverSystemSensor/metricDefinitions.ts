/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['numberOfInstances'],
    labels: [t('in-forge:plugins.sapJavaNetWeaverInstanceSensor.numberOfInstances')],
    min: 0,
    formatter: number
  }
];

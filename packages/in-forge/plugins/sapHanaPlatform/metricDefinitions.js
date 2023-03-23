/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'metrics.Availability.DATABASE_AVAILABILITY.status',
      'metrics.Availability.DATABASE_AVAILABILITY.minValue',
      'metrics.Availability.DATABASE_AVAILABILITY.maxValue'
    ],
    labels: [
      t('in-forge:plugins.sapHanaPlatform.status'),
      t('in-forge:plugins.sapHanaPlatform.minValue'),
      t('in-forge:plugins.sapHanaPlatform.maxValue')
    ],
    min: 0,
    formatter: number.compact
  }
];

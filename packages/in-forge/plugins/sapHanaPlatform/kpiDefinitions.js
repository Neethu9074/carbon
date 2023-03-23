/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.sapHanaPlatform.status'),
    metric: 'metrics.Availability.DATABASE_AVAILABILITY.status',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.sapHanaPlatform.minValue'),
    metric: 'metrics.Availability.DATABASE_AVAILABILITY.minValue',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.sapHanaPlatform.maxValue'),
    metric: 'metrics.Availability.DATABASE_AVAILABILITY.maxValue',
    formatter: number.compact
  }
];

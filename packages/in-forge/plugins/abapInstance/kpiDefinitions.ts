/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.abapInstance.status'),
    metric: 'metrics.ABAP_INSTANCE_AVAILABILITY.status',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.abapInstance.minValue'),
    metric: 'metrics.ABAP_INSTANCE_AVAILABILITY.minValue',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.abapInstance.maxValue'),
    metric: 'metrics.ABAP_INSTANCE_AVAILABILITY.maxValue',
    formatter: number.compact
  }
];

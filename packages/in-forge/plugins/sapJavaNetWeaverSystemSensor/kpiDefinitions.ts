/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:abapSystemsensor.activeABAPInstances'),
    metric: 'numberOfInstances',
    formatter: number.compact
  }
];

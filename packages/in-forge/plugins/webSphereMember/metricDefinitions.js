/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'weight',
    label: t('in-forge:plugins.webSphereMember.weight'),
    min: 0,
    formatter: number
  }
];

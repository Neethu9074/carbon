/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.microsoftPurview.kpi.dataMapCapacityUnits'),
    metric: 'dataMapCapacityUnits',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.microsoftPurview.kpi.scansFailed'),
    metric: 'scanFailed',
    formatter: number.compact
  }
];

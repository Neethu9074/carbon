/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureDatabricks.labelTriggerExecutionCount'),
    metric: 'triggerExecutionCount',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.azureDatabricks.labelInputRowPerSecond'),
    metric: 'inputRowsPerSecond',
    formatter: number.compact
  }
];

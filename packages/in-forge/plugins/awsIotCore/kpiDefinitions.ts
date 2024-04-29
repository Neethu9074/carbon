/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.awsIotCore.labelConnectSuccess'),
    metric: 'connect_success',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.awsIotCore.labelRulesExecuted'),
    metric: 'rules_executed',
    formatter: zeroDecimalPlaces
  }
];

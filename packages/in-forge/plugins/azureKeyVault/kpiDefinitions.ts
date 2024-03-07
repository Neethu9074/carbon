/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { percentagePlainZeroDecimalPlaces, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.azureKeyVault.kpi.labelAvailability'),
    metric: 'availability',
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureKeyVault.kpi.labelServiceApiLatency'),
    metric: 'serviceApiLatency',
    formatter: timeByMillisTwoDecimalPlaces
  }
];

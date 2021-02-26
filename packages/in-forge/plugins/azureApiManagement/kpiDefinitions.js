/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { millis, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.azureApiManagement.labelCapacity'),
    metric: 'metrics.Capacity',
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.azureApiManagement.labelDuration'),
    metric: 'metrics.Duration',
    formatter: millis.detailed
  }
];

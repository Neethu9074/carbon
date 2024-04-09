/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.glassfishApplicationContainer.requests'),
    metric: 'http_request_count',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.glassfishApplicationContainer.errors'),
    metric: 'http_error',
    formatter: zeroDecimalPlaces
  }
];

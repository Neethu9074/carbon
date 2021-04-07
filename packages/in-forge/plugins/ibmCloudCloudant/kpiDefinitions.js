/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: 'HTTP Requests Total',
    metric: t('in-forge:plugins.ibmCloudCloudant.labelHTTPRequestsTotal'),
    formatter: zeroDecimalPlaces
  }
];

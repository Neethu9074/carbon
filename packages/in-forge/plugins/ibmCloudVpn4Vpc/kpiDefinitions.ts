/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.gatewayBytesIn'),
    metric: 'gateway_bytes_in',
    formatter: bytesTwoDecimalPlaces
  },
  {
    label: t('in-forge:plugins.ibmCloudVpn4Vpc.gatewayBytesOut'),
    metric: 'gateway_bytes_out',
    formatter: bytesTwoDecimalPlaces
  }
];

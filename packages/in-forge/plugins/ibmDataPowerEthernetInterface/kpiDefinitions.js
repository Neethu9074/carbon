/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.ibmDataPowerEthernetInterface.receivedThroughput'),
    metric: 'receivedPerSecond',
    formatter: zeroDecimalPlacesPerSecond
  },
  {
    label: t('in-forge:plugins.ibmDataPowerEthernetInterface.transmitThroughput'),
    metric: 'transmitPerSecond',
    formatters: zeroDecimalPlacesPerSecond
  }
];

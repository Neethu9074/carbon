/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';

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

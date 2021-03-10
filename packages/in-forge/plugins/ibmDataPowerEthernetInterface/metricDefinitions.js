/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';

export default [
  {
    metrics: ['receivedPerSecond'],
    labels: [t('in-forge:plugins.ibmDataPowerEthernetInterface.receivedPerSecond')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerEthernetInterface.receivedPerSecond')],
    formatter: zeroDecimalPlacesPerSecond
  },
  {
    metrics: ['transmitPerSecond'],
    labels: [t('in-forge:plugins.ibmDataPowerEthernetInterface.transmitPerSecond')],
    min: 0,
    category: [t('in-forge:plugins.ibmDataPowerEthernetInterface.transmitPerSecond')],
    formatter: zeroDecimalPlacesPerSecond
  }
];

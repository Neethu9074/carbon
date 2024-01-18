/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['peerDeviceOutofsyncBytes'],
    labels: [t('in-forge:plugins.drbdPeer.peerDeviceOutofsyncBytes')],
    min: 0,
    formatter: zeroDecimalPlaces
  }
];

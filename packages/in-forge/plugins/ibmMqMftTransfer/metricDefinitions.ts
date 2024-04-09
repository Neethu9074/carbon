/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { seconds, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['elapsedSeconds'],
    labels: [t('in-forge:plugins.ibmMqMftTransfer.dashboard.elapsedSeconds')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftTransfer.transfer')],
    formatter: seconds
  },
  {
    metrics: ['transferRate'],
    labels: [t('in-forge:plugins.ibmMqMftTransfer.dashboard.transferRate')],
    min: 0,
    category: [t('in-forge:plugins.ibmMqMftTransfer.transfer')],
    formatter: bytes.perSecond.compact
  }
];

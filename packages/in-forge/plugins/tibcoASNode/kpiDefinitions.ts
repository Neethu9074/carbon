/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.tibcoASNode.liveDataSize'),
    metric: 'liveDataSize',
    formatter: bytes.compact
  },
  {
    label: t('in-forge:plugins.tibcoASNode.pendingGlobalRequests'),
    metric: 'pendingGlobalRequests',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoASNode.numberOfListeners'),
    metric: 'numberOfListeners',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.tibcoASNode.diskWriteRate'),
    metric: 'diskWriteRate',
    formatter: number.compact
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.sparkStandalone.labelAliveWorkers'),
    metric: 'workers.aliveWorkers',
    formatter: zeroDecimalPlaces
  },
  {
    label: t('in-forge:plugins.sparkStandalone.labelUsedMemory'),
    metric: 'workers.memoryInUseTotal',
    formatter: bytesZeroDecimalPlaces
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { bytesZeroDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';

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

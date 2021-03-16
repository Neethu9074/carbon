/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, twoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.jvmRuntimePlatform.memoryUsed'),
    metric: 'memory.used',
    formatter: bytes.detailed
  },
  {
    label: t('in-forge:plugins.jvmRuntimePlatform.blockedThreads'),
    metric: 'threads.blocked',
    formatter: twoDecimalPlaces
  }
];

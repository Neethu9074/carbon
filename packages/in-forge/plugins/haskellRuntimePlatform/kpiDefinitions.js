/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.haskellRuntimePlatform.cpuTimeSecond'),
    metric: 'rts.gc.cpu_ms_delta',
    formatter: millis.compact
  },
  {
    label: t('in-forge:plugins.haskellRuntimePlatform.gcCpuTimeSecond'),
    metric: 'rts.gc.gc_cpu_ms_delta',
    formatter: millis.compact
  }
];

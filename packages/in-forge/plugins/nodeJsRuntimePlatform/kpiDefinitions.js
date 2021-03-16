/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { bytes, time } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.nodeJsRuntimePlatform.gcPause'),
    metric: 'gc.gcPause',
    formatter: time
  },
  {
    label: t('in-forge:plugins.nodeJsRuntimePlatform.rss'),
    metric: 'memory.rss',
    formatter: bytes.detailed
  }
];

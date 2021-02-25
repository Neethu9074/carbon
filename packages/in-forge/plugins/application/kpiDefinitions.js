/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { ms, number } from 'in-services/formatters/number';

export default [
  {
    label: t('in-forge:plugins.application.inboundCallsPerSecond'),
    metric: 'inbound_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.application.inboundCallsAvgLatency'),
    metric: 'inbound_duration.mean',
    formatter: ms.compact
  }
];

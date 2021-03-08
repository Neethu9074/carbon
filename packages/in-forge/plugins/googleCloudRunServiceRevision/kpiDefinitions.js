/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { millis, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-forge:plugins.googleCloudRunServiceRevision.requestCount'),
    metric: 'request_count',
    formatter: number.compact
  },
  {
    label: t('in-forge:plugins.googleCloudRunServiceRevision.requestLatencyP99'),
    metric: 'request_latencies_p99',
    formatter: millis.compact
  }
];

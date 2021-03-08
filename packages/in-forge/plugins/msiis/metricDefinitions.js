/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: getDynamicMetricMatch('siteperf', 'total_requests', 'Website'),
    label: t('in-forge:plugins.msiis.totalNumberOfRequests'),
    category: [t('in-forge:plugins.msiis.websites')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'current_connections', 'Website'),
    label: t('in-forge:plugins.msiis.currentNumberOfConnections'),
    category: [t('in-forge:plugins.msiis.websites')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'get_requests', 'Website'),
    label: t('in-forge:plugins.msiis.getRequests'),
    min: 0,
    category: [t('in-forge:plugins.msiis.request')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'post_requests', 'Website'),
    label: t('in-forge:plugins.msiis.postRequests'),
    min: 0,
    category: [t('in-forge:plugins.msiis.request')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'put_requests', 'Website'),
    label: t('in-forge:plugins.msiis.putRequests'),
    min: 0,
    category: [t('in-forge:plugins.msiis.request')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'bytes_sent', 'Website'),
    label: t('in-forge:plugins.msiis.bytesSent'),
    category: [t('in-forge:plugins.msiis.websites')],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('siteperf', 'bytes_received', 'Website'),
    label: t('in-forge:plugins.msiis.bytesReceived'),
    category: [t('in-forge:plugins.msiis.websites')],
    min: 0,
    formatter: number
  }
];

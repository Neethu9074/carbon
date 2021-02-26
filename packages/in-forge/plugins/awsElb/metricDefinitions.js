/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { number, bytes, millis } from 'in-services/formatters/number';

export default [
  {
    metric: 'processed_bytes',
    label: t('in-forge:plugins.awsElb.labelProcessedBytes'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'new_flow_count',
    label: t('in-forge:plugins.awsElb.labelNewFlowCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: bytes.compact
  },
  {
    metric: 'client_reset_count',
    label: t('in-forge:plugins.awsElb.labelClientRST'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_reset_count',
    label: t('in-forge:plugins.awsElb.labelElbRST'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'target_reset_count',
    label: t('in-forge:plugins.awsElb.labelTargetRST'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'active_connection_count',
    label: t('in-forge:plugins.awsElb.labelActiveConnections'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'new_connection_count',
    label: t('in-forge:plugins.awsElb.labelNewConnections'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'rejected_connection_count',
    label: t('in-forge:plugins.awsElb.labelRejectedConnections'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_4XX_count',
    label: t('in-forge:plugins.awsElb.labelElbStatus4xxCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'elb_5XX_count',
    label: t('in-forge:plugins.awsElb.labelElbStatus5xxCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'request_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelRequestCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'client_tls_negotiation_error_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelClientTLSErrorCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_tls_negotiation_error_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelTargetTLSErrorCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_response_time',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelTargetResponseTime'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_connection_error_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelTargetConnectionErrorCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_2XX_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelTargetStatus2xxCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_3XX_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: t('in-forge:plugins.awsElb.labelTargetStatus3xxCount'),
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_4XX_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: 'in-forge:plugins.awsElb.labelTargetStatus4xxCount',
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'target_5XX_count',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: 'in-forge:plugins.awsElb.labelTargetStatus5xxCount',
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: getDynamicMetricMatch('azMetrics', 'latency', t('in-forge:plugins.awsElb.placeholderAvailabilityZone')),
    label: 'in-forge:plugins.titleLatency',
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: getDynamicMetricMatch(
      'azMetrics',
      'backend_connection_errors',
      t('in-forge:plugins.awsElb.placeholderAvailabilityZone')
    ),
    label: 'in-forge:plugins.awsElb.labelBackendConnectionErrors',
    category: [t('in-forge:plugins.awsElb.categoryNetwork')],
    min: 0,
    formatter: number.compact
  }
];

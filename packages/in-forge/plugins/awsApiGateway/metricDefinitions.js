/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'api_requests_count',
    label: t('in-forge:plugins.awsApiGateway.labelCount'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'integration_latency',
    label: t('in-forge:plugins.awsApiGateway.labelIntegrationLatency'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: 'latency_total',
    label: t('in-forge:plugins.awsApiGateway.labelLatencyTotal'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: millis.detailed
  },
  {
    metric: '4xx_avg',
    label: t('in-forge:plugins.awsApiGateway.labelAverage'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.detailed
  },
  {
    metric: '4xx_sum',
    label: t('in-forge:plugins.awsApiGateway.labelSum'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: '5xx_avg',
    label: t('in-forge:plugins.awsApiGateway.labelAverage'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.detailed
  },
  {
    metric: '5xx_sum',
    label: t('in-forge:plugins.awsApiGateway.labelSum'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: '4xx_errors_avg',
    label: t('in-forge:plugins.awsApiGateway.labelAverage'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.detailed
  },
  {
    metric: '4xx_errors_sum',
    label: t('in-forge:plugins.awsApiGateway.labelSum'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: '5xx_errors_avg',
    label: t('in-forge:plugins.awsApiGateway.labelAverage'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.detailed
  },
  {
    metric: '5xx_errors_sum',
    label: t('in-forge:plugins.awsApiGateway.labelSum'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cache_hit_count_avg',
    label: t('in-forge:plugins.awsApiGateway.labelAverage'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'cache_hit_count_sum',
    label: t('in-forge:plugins.awsApiGateway.labelSum'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cache_miss_count_avg',
    label: t('in-forge:plugins.awsApiGateway.labelAverage'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'cache_miss_count_sum',
    label: t('in-forge:plugins.awsApiGateway.labelSum'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'connect_count',
    label: t('in-forge:plugins.awsApiGateway.labelCount'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'message_count',
    label: t('in-forge:plugins.awsApiGateway.labelCount'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'integration_error',
    label: t('in-forge:plugins.awsApiGateway.labelIntegrationError'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'client_error',
    label: t('in-forge:plugins.awsApiGateway.labelClientError'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'execution_error',
    label: t('in-forge:plugins.awsApiGateway.labelExecutionError'),
    category: [t('in-forge:plugins.awsApiGateway.categoryNetwork')],
    min: 0,
    formatter: number.compact
  }
];

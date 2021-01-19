/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'eDTU_limit', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'cpu_limit', 'Elastic Pool')
    ],
    labels: ['eDTU Limit', 'CPU Limit'],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'eDTU_used', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'cpu_used', 'Elastic Pool')
    ],
    labels: ['eDTU Used', 'CPU Used'],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_consumption_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'storage_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'cpu_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'physical_data_read_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'log_write_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'xtp_storage_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'workers_percent', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'sessions_percent', 'Elastic Pool')
    ],
    labels: [
      'eDTU Percentage',
      'Storage percentage',
      'CPU percentage',
      'Data IO',
      'Log IO',
      'In-Memory OLTP storage',
      'Workers',
      'Sessions'
    ],
    formatter: percentagePlainTwoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'storage_limit', 'Elastic Pool'),
      getDynamicMetricMatch('metrics', 'storage_used', 'Elastic Pool')
    ],
    labels: ['Storage Limit', 'Storage Used'],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];

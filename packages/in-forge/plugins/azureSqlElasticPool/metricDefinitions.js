import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [getMetricMatch('metrics', 'eDTU_limit'), getMetricMatch('metrics', 'cpu_limit')],
    labels: ['eDTU Limit', 'CPU Limit'],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [getMetricMatch('metrics', 'eDTU_used'), getMetricMatch('metrics', 'cpu_used')],
    labels: ['eDTU Used', 'CPU Used'],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getMetricMatch('metrics', 'dtu_consumption_percent'),
      getMetricMatch('metrics', 'storage_percent'),
      getMetricMatch('metrics', 'cpu_percent'),
      getMetricMatch('metrics', 'physical_data_read_percent'),
      getMetricMatch('metrics', 'log_write_percent'),
      getMetricMatch('metrics', 'xtp_storage_percent'),
      getMetricMatch('metrics', 'workers_percent'),
      getMetricMatch('metrics', 'sessions_percent')
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
    metrics: [getMetricMatch('metrics', 'storage_limit'), getMetricMatch('metrics', 'storage_used')],
    labels: ['Storage Limit', 'Storage Used'],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];

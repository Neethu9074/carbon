import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      getMetricMatch('metrics', 'dtu_limit'),
      getMetricMatch('metrics', 'cpu_limit'),
      getMetricMatch('metrics', 'connection_successful'),
      getMetricMatch('metrics', 'connection_failed'),
      getMetricMatch('metrics', 'blocked_by_firewall'),
      getMetricMatch('metrics', 'deadlock')
    ],
    labels: [
      'DTU Limit',
      'CPU Limit',
      'Successful Connections',
      'Failed Connections',
      'Blocked by Firewall',
      'Deadlocks'
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [getMetricMatch('metrics', 'dtu_used'), getMetricMatch('metrics', 'cpu_used')],
    labels: ['DTU Used', 'CPU Used'],
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
      'DTU Percentage',
      'Database size',
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
    metrics: [getMetricMatch('metrics', 'storage')],
    labels: ['Total database size'],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];

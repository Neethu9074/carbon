import {
  percentagePlainTwoDecimalPlaces,
  zeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'total_dtu_limit',
      'total_dtu_used',
      getMetricMatch('metrics.databases', 'dtu_limit'),
      getMetricMatch('metrics.databases', 'dtu_used'),
      getMetricMatch('metrics.databases', 'connection_successful'),
      getMetricMatch('metrics.databases', 'connection_failed'),
      getMetricMatch('metrics.databases', 'blocked_by_firewall'),
      getMetricMatch('metrics.databases', 'deadlock'),
      getMetricMatch('metrics.elasticPools', 'eDTU_limit'),
      getMetricMatch('metrics.elasticPools', 'eDTU_used')
    ],
    labels: [
      'Total DTU Limit',
      'Total DTU Used',
      'DTU Limit',
      'DTU Used',
      'Successful Connections',
      'Failed Connections',
      'Blocked by Firewall',
      'Deadlocks',
      'eDTU Limit',
      'eDTU Used'
    ],
    formatter: zeroDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getMetricMatch('metrics.databases', 'dtu_consumption_percent'),
      getMetricMatch('metrics.databases', 'storage_percent'),
      getMetricMatch('metrics.databases', 'cpu_percent'),
      getMetricMatch('metrics.databases', 'physical_data_read_percent'),
      getMetricMatch('metrics.databases', 'log_write_percent'),
      getMetricMatch('metrics.databases', 'xtp_storage_percent'),
      getMetricMatch('metrics.databases', 'workers_percent'),
      getMetricMatch('metrics.databases', 'sessions_percent'),
      getMetricMatch('metrics.elasticPools', 'dtu_consumption_percent'),
      getMetricMatch('metrics.elasticPools', 'storage_percent'),
      getMetricMatch('metrics.elasticPools', 'cpu_percent'),
      getMetricMatch('metrics.elasticPools', 'physical_data_read_percent'),
      getMetricMatch('metrics.elasticPools', 'log_write_percent'),
      getMetricMatch('metrics.elasticPools', 'xtp_storage_percent'),
      getMetricMatch('metrics.elasticPools', 'workers_percent'),
      getMetricMatch('metrics.elasticPools', 'sessions_percent')
    ],
    labels: [
      'DTU Percentage',
      'Database size',
      'CPU percentage',
      'Data IO',
      'Log IO',
      'In-Memory OLTP storage',
      'Workers',
      'Sessions',
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
      getMetricMatch('metrics.databases', 'storage'),
      getMetricMatch('metrics.elasticPools', 'storage_limit'),
      getMetricMatch('metrics.elasticPools', 'storage_used')
    ],
    labels: ['Total database size', 'Storage Limit', 'Storage Used'],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];

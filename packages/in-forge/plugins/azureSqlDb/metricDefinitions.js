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
      getDynamicMetricMatch('metrics', 'dtu_limit', 'Database'),
      getDynamicMetricMatch('metrics', 'cpu_limit', 'Database'),
      getDynamicMetricMatch('metrics', 'connection_successful', 'Database'),
      getDynamicMetricMatch('metrics', 'connection_failed', 'Database'),
      getDynamicMetricMatch('metrics', 'blocked_by_firewall', 'Database'),
      getDynamicMetricMatch('metrics', 'deadlock', 'Database')
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
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_used', 'Database'),
      getDynamicMetricMatch('metrics', 'cpu_used', 'Database')
    ],
    labels: ['DTU Used', 'CPU Used'],
    formatter: twoDecimalPlaces,
    min: 0
  },
  {
    metrics: [
      getDynamicMetricMatch('metrics', 'dtu_consumption_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'storage_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'cpu_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'physical_data_read_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'log_write_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'xtp_storage_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'workers_percent', 'Database'),
      getDynamicMetricMatch('metrics', 'sessions_percent', 'Database')
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
    metrics: [getDynamicMetricMatch('metrics', 'storage', 'Database')],
    labels: ['Total database size'],
    formatter: bytesTwoDecimalPlaces,
    min: 0
  }
];

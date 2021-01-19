/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Operation Count',
    metric: 'nodeMetrics.migrationQueueSize',
    formatter: number.compact
  },
  {
    label: 'Client Endpoint Count',
    metric: 'nodeMetrics.clientEndpointCount',
    formatter: number.compact
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Search Latency',
    metric: 'search_latency',
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    label: 'Cluster Status (Red)',
    metric: 'cluster_status_red',
    formatter: number.compact
  }
];

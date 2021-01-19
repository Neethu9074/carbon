/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Cluster Requests',
    metric: 'master_cluster_requests',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Average Load',
    metric: 'avg_load',
    formatter: zeroDecimalPlaces
  }
];

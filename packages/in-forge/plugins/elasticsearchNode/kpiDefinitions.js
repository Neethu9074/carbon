/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    label: 'Indices',
    metric: 'indices_count',
    formatter: zeroDecimalPlaces
  },
  {
    label: 'Active Shards',
    metric: 'shards.node_active_shards',
    formatter: zeroDecimalPlaces
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Throughput (Ops/Second)',
    metric: 'throughput',
    formatter: number.compact
  },
  {
    label: 'Keyspace Hits',
    metric: 'keyspace_hits',
    formatter: number.compact
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Partitions',
    metric: 'partition_count',
    formatter: number.compact
  },
  {
    label: 'Under Replicated Partitions',
    metric: 'under_replicated_partitions',
    formatters: number.compact
  }
];

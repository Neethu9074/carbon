/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    metric: 'active_controller_count',
    label: 'Active controller count',
    category: ['Controller'],
    formatter: number
  },
  {
    metric: 'global_topic_count',
    label: 'Topic count',
    category: ['Topic'],
    formatter: number
  },
  {
    metric: 'global_partition_count',
    label: 'Partition count',
    category: ['Partition'],
    formatter: number
  },
  {
    metric: 'offline_partitions_count',
    label: 'Offline partition count',
    category: ['Partition'],
    formatter: number
  },
  {
    metric: 'kafka_data_logs_disk_used',
    label: 'Data logs',
    category: ['Partition'],
    formatter: percentage
  }
];

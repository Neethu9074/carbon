/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'All Queues Messages Enqueue',
    metric: 'totalQueuesEnqueueCount',
    formatter: number.compact
  },
  {
    label: 'All Topics Messages Enqueue',
    metric: 'totalTopicsEnqueueCount',
    formatters: number.compact
  }
];

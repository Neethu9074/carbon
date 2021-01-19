/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, seconds } from 'in-services/formatters/number';

export default [
  {
    label: 'Queue Depth',
    metric: 'queueDepth',
    formatter: number.compact
  },
  {
    label: 'Oldest Message',
    metric: 'oldestMessage',
    formatters: seconds.fixedCompact
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'CPU Requests',
    metric: 'requiredCapacityCPURatio',
    formatter: percentage.compact
  },
  {
    label: 'Memory Requests',
    metric: 'requiredCapacityMemoryRatio',
    formatter: percentage.compact
  }
];

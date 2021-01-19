/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number, percentage } from 'in-services/formatters/number';

export default [
  {
    label: 'Connector Count',
    metric: 'connectorCount',
    formatter: number.compact
  },
  {
    label: 'Connector Startup Failure',
    metric: 'connectorStartupFailurePercentage',
    formatter: percentage.compact
  },
  {
    label: 'Task Startup Failure',
    metric: 'taskStartupFailurePercentage',
    formatter: percentage.compact
  }
];

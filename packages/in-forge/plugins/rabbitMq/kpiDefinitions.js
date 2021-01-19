/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { greaterThanZeroFormatter } from 'in-forge/plugins/rabbitMq/formatters';

export default [
  {
    label: 'Messages Ready',
    metric: 'overview.messages_ready',
    formatter: greaterThanZeroFormatter
  },
  {
    label: 'Consumers',
    metric: 'overview.consumers',
    formatter: greaterThanZeroFormatter
  }
];

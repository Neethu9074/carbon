/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Active Controllers',
    metric: 'active_controller_count',
    formatter: number.compact
  },
  {
    label: 'Topics',
    metric: 'global_topic_count',
    formatters: number.compact
  }
];

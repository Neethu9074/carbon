/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Requests',
    metric: 'requests',
    formatter: number.compact
  },
  {
    label: 'Traffic (kBytes)',
    metric: 'kBytes',
    formatters: number.compact
  }
];

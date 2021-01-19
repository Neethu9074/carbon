/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    key: 'callsAgg',
    label: 'Calls',
    formatter: number.compact
  },
  {
    key: 'erroneousCalls',
    label: 'Erroneous Calls',
    formatter: number.compact
  }
];

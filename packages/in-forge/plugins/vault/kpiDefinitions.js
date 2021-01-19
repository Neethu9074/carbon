/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Secrets Created',
    metric: 'secret.create.count',
    formatter: number.compact
  },
  {
    label: 'Secrets Read',
    metric: 'secret.read.count',
    formatter: number.compact
  },
  {
    label: 'Tokens Lookup',
    metric: 'ttoken.lookup.count',
    formatters: number.compact
  }
];

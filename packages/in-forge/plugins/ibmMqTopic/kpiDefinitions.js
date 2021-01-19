/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Messages',
    metric: 'messagesCount',
    formatter: number.compact
  },
  {
    label: 'Publishers',
    metric: 'publishCount',
    formatters: number.compact
  }
];

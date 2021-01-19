/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Get Records',
    metric: 'get_records_records',
    formatter: number.compact
  },
  {
    label: 'Put Records',
    metric: 'put_records_records',
    formatter: number.compact
  }
];

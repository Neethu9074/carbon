/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    label: 'Provisioned Read Capacity',
    metric: 'provisioned_read',
    formatter: number.detailed
  },
  {
    label: 'Throttled Read Requests (Get)',
    metric: 'throttled_get',
    formatter: number.compact
  }
];

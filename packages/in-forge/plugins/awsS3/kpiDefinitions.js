/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: 'All Requests',
    metric: 'all_requests',
    formatter: number.compact
  },
  {
    label: 'Downloaded Traffic',
    metric: 'bytes_downloaded',
    formatters: bytes.compact
  }
];

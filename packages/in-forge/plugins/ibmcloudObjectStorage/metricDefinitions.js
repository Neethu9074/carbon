/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes } from 'in-services/formatters/number';

export default [
  {
    metrics: ['object_count_total'],
    labels: ['Total Object Count'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['used_bytes_total'],
    labels: ['Total Used Bytes'],
    min: 0,
    category: ['Memory'],
    formatter: bytes
  }
];

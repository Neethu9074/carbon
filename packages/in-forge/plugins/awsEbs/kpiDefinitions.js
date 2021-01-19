/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number } from 'in-services/formatters/number';

export default [
  {
    label: 'Read Bytes',
    metric: 'read_bytes',
    formatter: bytes.compact
  },
  {
    label: 'Read Operations',
    metric: 'read_ops',
    formatter: number.compact
  }
];

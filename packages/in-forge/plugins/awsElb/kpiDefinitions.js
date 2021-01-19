/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes } from 'in-services/formatters/number';

export default [
  {
    label: 'Processed Bytes',
    metric: 'processed_bytes',
    formatter: bytes.compact
  },
  {
    label: 'New Flow Count',
    metric: 'new_flow_count',
    formatter: bytes.compact
  }
];

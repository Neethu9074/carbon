/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes } from 'in-services/formatters/number';

export default [
  {
    label: 'Used Memory (Bytes)',
    metric: 'node.mem_used',
    formatter: bytes.compact
  },
  {
    label: 'Used Disk (Bytes)',
    metric: 'node.couch_docs_actual_disk_size',
    formatter: bytes.compact
  }
];

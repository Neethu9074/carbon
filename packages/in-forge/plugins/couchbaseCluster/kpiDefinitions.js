/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes } from 'in-services/formatters/number';

export default [
  {
    label: 'Used Disk (Bytes)',
    metric: 'cluster.usedDisk',
    formatter: bytes.compact
  },
  {
    label: 'Used Memory (Bytes)',
    metric: 'cluster.usedMemory',
    formatter: bytes.compact
  }
];

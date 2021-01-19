/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { healthFormatter } from 'in-forge/plugins/ceph/formatters';
import { bytes } from 'in-services/formatters/number';

export default [
  {
    label: 'Overall Status',
    metric: 'overall_status',
    formatter: healthFormatter
  },
  {
    label: 'Active Monitors',
    metric: 'num_active_mons',
    formatter: bytes.compact
  }
];

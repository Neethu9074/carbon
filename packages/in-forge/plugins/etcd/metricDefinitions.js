/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, number, seconds } from 'in-services/formatters/number';

export default [
  {
    metrics: ['requests_received', 'requests_sent'],
    labels: ['Received', 'Sent'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
    labels: ['Received', 'Sent'],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['storage.expire_count'],
    labels: ['Expire count'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.watchers'],
    labels: ['Watchers'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.compare_and_swap_fail', 'storage.compare_and_swap_success'],
    labels: ['Compare and swap fail', 'Compare and swap success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.compare_and_delete_fail', 'storage.compare_and_delete_success'],
    labels: ['Compare and delete fail', 'Compare and delete success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.create_fail', 'storage.create_success'],
    labels: ['Create fail', 'Create success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.delete_fail', 'storage.delete_success'],
    labels: ['Delete fail', 'Delete success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.gets_fail', 'storage.gets_success'],
    labels: ['Gets fail', 'Gets success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.sets_fail', 'storage.sets_success'],
    labels: ['Sets fail', 'Sets success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.update_fail', 'storage.update_success'],
    labels: ['Update fail', 'Update success'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'health.server_leader_changes',
    label: 'Server leader changes',
    formatter: number
  },
  {
    metric: 'health.disk_wal_fsync_duration',
    label: 'Disk fsync duration',
    formatter: seconds
  },
  {
    metric: 'health.disk_backend_commit_duration',
    label: 'Disk backend commit duration',
    formatter: seconds
  },
  {
    metric: 'health.debugging_snap_save_total_duration',
    label: 'Snap save total duration',
    formatter: seconds
  },
  {
    metric: 'health.server_has_leader',
    label: 'Server has leader',
    formatter: number
  },
  {
    metric: 'health.server_proposals_committed',
    label: 'Number of proposals commited',
    formatter: number
  },
  {
    metric: 'health.process_open_fds',
    label: 'Number of open file descriptors',
    formatter: number
  },
  {
    metric: 'health.process_max_fds',
    label: 'Maximum number of file descriptors',
    formatter: number
  },
  {
    metric: 'health.server_proposals_applied',
    label: 'Number of proposals applied',
    formatter: number
  },
  {
    metric: 'health.server_proposals_pending',
    label: 'Number of proposals pending',
    formatter: number
  },
  {
    metric: 'health.server_proposals_failed',
    label: 'Number of proposals failed',
    formatter: number
  }
];

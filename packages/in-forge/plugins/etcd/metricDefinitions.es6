import { zeroDecimalPlaces, bytesZeroDecimalPlaces, number, millis } from 'in-services/formatters/number';

export default [
  {
    metrics: ['requests_received', 'requests_sent'],
    labels: ['Received', 'Sent'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
    labels: ['Received', 'Sent'],
    min: 0,
    formatter: bytesZeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.expire_count'],
    labels: ['Expire count'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.watchers'],
    labels: ['Watchers'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.compare_and_swap_fail', 'storage.compare_and_swap_success'],
    labels: ['Compare and swap fail', 'Compare and swap success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.compare_and_delete_fail', 'storage.compare_and_delete_success'],
    labels: ['Compare and delete fail', 'Compare and delete success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.create_fail', 'storage.create_success'],
    labels: ['Create fail', 'Create success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.delete_fail', 'storage.delete_success'],
    labels: ['Delete fail', 'Delete success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.gets_fail', 'storage.gets_success'],
    labels: ['Gets fail', 'Gets success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.sets_fail', 'storage.sets_success'],
    labels: ['Sets fail', 'Sets success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metrics: ['storage.update_fail', 'storage.update_success'],
    labels: ['Update fail', 'Update success'],
    min: 0,
    formatter: zeroDecimalPlaces,
    isAvailable
  },
  {
    metric: 'health.server_leader_changes',
    label: 'Server leader changes',
    formatter: number
  },
  {
    metric: 'health.disk_wal_fsync_duration',
    label: 'Disk fsync duration',
    formatter: millis
  },
  {
    metric: 'health.disk_backend_commit_duration',
    label: 'Disk backend commit duration',
    formatter: millis
  },
  {
    metric: 'health.debugging_snap_save_total_duration',
    label: 'Snap save total duration',
    formatter: millis
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

function isAvailable(snapshot) {
  return snapshot.getIn(['data', 'sensorConnectionStatus'], true);
}

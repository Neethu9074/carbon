/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { zeroDecimalPlaces, bytesZeroDecimalPlaces, number, seconds } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['requests_received', 'requests_sent'],
    labels: [t('in-forge:plugins.etcd.received'), t('in-forge:plugins.etcd.sent')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
    labels: [t('in-forge:plugins.etcd.received'), t('in-forge:plugins.etcd.sent')],
    min: 0,
    formatter: bytesZeroDecimalPlaces
  },
  {
    metrics: ['storage.expire_count'],
    labels: [t('in-forge:plugins.etcd.expireCount')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.watchers'],
    labels: [t('in-forge:plugins.etcd.watchers')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.compare_and_swap_fail', 'storage.compare_and_swap_success'],
    labels: [t('in-forge:plugins.etcd.compareAndSwapFail'), t('in-forge:plugins.etcd.compareAndSwapSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.compare_and_delete_fail', 'storage.compare_and_delete_success'],
    labels: [t('in-forge:plugins.etcd.compareAndDeleteFail'), t('in-forge:plugins.etcd.compareAndDeleteSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.create_fail', 'storage.create_success'],
    labels: [t('in-forge:plugins.etcd.createFail'), t('in-forge:plugins.etcd.createSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.delete_fail', 'storage.delete_success'],
    labels: [t('in-forge:plugins.etcd.deleteFail'), t('in-forge:plugins.etcd.deleteSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.gets_fail', 'storage.gets_success'],
    labels: [t('in-forge:plugins.etcd.getsFail'), t('in-forge:plugins.etcd.getsSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.sets_fail', 'storage.sets_success'],
    labels: [t('in-forge:plugins.etcd.setsFail'), t('in-forge:plugins.etcd.setsSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['storage.update_fail', 'storage.update_success'],
    labels: [t('in-forge:plugins.etcd.updateFail'), t('in-forge:plugins.etcd.updateSuccess')],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metric: 'health.server_leader_changes',
    label: t('in-forge:plugins.etcd.serverLeaderChanges'),
    formatter: number
  },
  {
    metric: 'health.disk_wal_fsync_duration',
    label: t('in-forge:plugins.etcd.diskFsyncDuration'),
    formatter: seconds
  },
  {
    metric: 'health.disk_backend_commit_duration',
    label: t('in-forge:plugins.etcd.diskBackendCommitDuration'),
    formatter: seconds
  },
  {
    metric: 'health.debugging_snap_save_total_duration',
    label: t('in-forge:plugins.etcd.snapSaveTotalDuration'),
    formatter: seconds
  },
  {
    metric: 'health.server_has_leader',
    label: t('in-forge:plugins.etcd.serverHasLeader'),
    formatter: number
  },
  {
    metric: 'health.server_proposals_committed',
    label: t('in-forge:plugins.etcd.numberOfProposalsCommited'),
    formatter: number
  },
  {
    metric: 'health.process_open_fds',
    label: t('in-forge:plugins.etcd.numberOfOpenFileDescriptors'),
    formatter: number
  },
  {
    metric: 'health.process_max_fds',
    label: t('in-forge:plugins.etcd.maximumNumberOfFileDescriptors'),
    formatter: number
  },
  {
    metric: 'health.server_proposals_applied',
    label: t('in-forge:plugins.etcd.numberOfProposalsApplied'),
    formatter: number
  },
  {
    metric: 'health.server_proposals_pending',
    label: t('in-forge:plugins.etcd.numberOfProposalsPending'),
    formatter: number
  },
  {
    metric: 'health.server_proposals_failed',
    label: t('in-forge:plugins.etcd.numberOfProposalsFailed'),
    formatter: number
  }
];

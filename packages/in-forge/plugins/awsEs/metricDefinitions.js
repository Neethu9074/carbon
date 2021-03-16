/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  number,
  seconds,
  bytesPerSecondTwoDecimalPlaces,
  bytes,
  timeByMillisTwoDecimalPlaces
} from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'cluster_status_green',
    label: t('in-forge:plugins.awsEs.labelGreen'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cluster_status_yellow',
    label: t('in-forge:plugins.awsEs.labelYellow'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cluster_status_red',
    label: t('in-forge:plugins.awsEs.labelRed'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'nodes',
    label: t('in-forge:plugins.awsEs.labelNumOfNodesInCluster'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'cpu_utilization',
    label: t('in-forge:plugins.awsEs.labelCpuUtilization'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'searchable_documents',
    label: t('in-forge:plugins.awsEs.labelSearchableDocument'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'free_storage_space',
    label: t('in-forge:plugins.awsEs.labelFreeStorageSpace'),
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'cluster_used_space',
    label: t('in-forge:plugins.awsEs.labelClusterUsedSpace'),
    min: 0,
    formatter: bytes.detailed
  },
  {
    metric: 'cluster_index_writes_blocked',
    label: t('in-forge:plugins.awsEs.labelClusterIndexWritesBlocked'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'jvm_memory_pressure',
    label: t('in-forge:plugins.awsEs.labelJvmMemoryPressure'),
    min: 0,
    formatter: number.detailed
  },
  {
    metric: 'automated_snapshot_failure',
    label: t('in-forge:plugins.awsEs.labelAutomatedSnapshotFailure'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: '2xx',
    label: t('in-forge:plugins.labelRequests.2xx'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: '3xx',
    label: t('in-forge:plugins.labelRequests.3xx'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: '4xx',
    label: t('in-forge:plugins.labelRequests.4xx'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: '5xx',
    label: t('in-forge:plugins.labelRequests.5xx'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'read_latency',
    label: t('in-forge:plugins.awsEs.labelReadLatency'),
    min: 0,
    formatter: seconds.fixedCompact
  },
  {
    metric: 'write_latency',
    label: t('in-forge:plugins.awsEs.labelWriteLatency'),
    min: 0,
    formatter: seconds.fixedCompact
  },
  {
    metric: 'read_throughput',
    label: t('in-forge:plugins.awsEs.labelReadThroughput'),
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: 'write_throughput',
    label: t('in-forge:plugins.awsEs.labelWriteThroughput'),
    min: 0,
    formatter: bytesPerSecondTwoDecimalPlaces
  },
  {
    metric: 'read_iops',
    label: t('in-forge:plugins.awsEs.labelReadIOPS'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'write_iops',
    label: t('in-forge:plugins.awsEs.labelWriteIOPS'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'search_latency',
    label: t('in-forge:plugins.awsEs.labelSearchLatency'),
    min: 0,
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    metric: 'cpu_credit_balance',
    label: t('in-forge:plugins.awsEs.labelCpuCreditBalance'),
    min: 0,
    formatter: number.compact
  },
  {
    metric: 'deleted_documents',
    label: t('in-forge:plugins.awsEs.labelDeletedDocuments'),
    min: 0,
    formatter: number.compact
  }
];

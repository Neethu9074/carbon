/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number, bytes, percentage, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'apps_running',
    label: t('in-forge:plugins.awsEmr.labelAppsRunning'),
    min: 0,
    formatter: number
  },
  {
    metric: 'apps_pending',
    label: t('in-forge:plugins.awsEmr.labelAppsPending'),
    min: 0,
    formatter: number
  },
  {
    metric: 'apps_failed',
    label: t('in-forge:plugins.awsEmr.labelAppsFailed'),
    min: 0,
    formatter: number
  },
  {
    metric: 'memory_allocated_megabytes',
    label: t('in-forge:plugins.awsEmr.labelMemoryAllocated'),
    min: 0,
    formatter: bytes
  },
  {
    metric: 'memory_reserved_megabytes',
    label: t('in-forge:plugins.awsEmr.labelMemoryReserved'),
    min: 0,
    formatter: bytes
  },
  {
    metric: 'memory_available_megabytes',
    label: t('in-forge:plugins.awsEmr.labelMemoryAvailable'),
    min: 0,
    formatter: bytes
  },
  {
    metric: 'container_allocated',
    label: t('in-forge:plugins.awsEmr.labelContainersAllocated'),
    min: 0,
    formatter: number
  },
  {
    metric: 's3_bytes_written',
    label: t('in-forge:plugins.awsEmr.labelWritten'),
    min: 0,
    formatter: bytes
  },
  {
    metric: 's3_bytes_read',
    label: t('in-forge:plugins.awsEmr.labelRead'),
    min: 0,
    formatter: bytes
  },
  {
    metric: 'hdfs_utilization',
    label: t('in-forge:plugins.awsEmr.labelHDFSUtilizationDeprecated'),
    min: 0,
    formatter: percentagePlainTwoDecimalPlaces
  },
  {
    metric: 'HDFS_utilization',
    label: t('in-forge:plugins.awsEmr.labelHDFSUtilization'),
    min: 0,
    formatter: percentage
  },
  {
    metric: 'total_load',
    label: t('in-forge:plugins.awsEmr.labelTotalConcurrentDataTransfers'),
    min: 0,
    formatter: number
  },
  {
    metric: 'active_nodes',
    label: t('in-forge:plugins.awsEmr.labelActiveNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'decommissioned_nodes',
    label: t('in-forge:plugins.awsEmr.labelDecommissionedNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'lost_nodes',
    label: t('in-forge:plugins.awsEmr.labelLostNodes'),
    min: 0,
    formatter: number
  },
  {
    metric: 'unhealthy_nodes',
    label: t('in-forge:plugins.awsEmr.labelUnhealthyNodes'),
    min: 0,
    formatter: number
  }
];

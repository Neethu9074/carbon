/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { number, bytes, percentagePlainZeroDecimalPlaces, micros } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'ims_health.affinity_count',
      'ims_health.lock_waiters',
      'ims_health.total_cpu_percent',
      'ims_health.total_deq_rate',
      'ims_health.total_enq_rate',
      'ims_health.total_io_rate',
      'ims_health.total_paging_rate',
      'ims_health.total_transaction_queue',
      'ims_health.total_transaction_rate'
    ],
    labels: [
      t('in-forge:plugins.zIms.affinityCount'),
      t('in-forge:plugins.zIms.lockWaiters'),
      t('in-forge:plugins.zIms.totalCpuPercent'),
      t('in-forge:plugins.zIms.totalDeqRate'),
      t('in-forge:plugins.zIms.totalEnqRate'),
      t('in-forge:plugins.zIms.totalIoRate'),
      t('in-forge:plugins.zIms.totalPagingRate'),
      t('in-forge:plugins.zIms.totalTransactionQueue'),
      t('in-forge:plugins.zIms.totalTransactionRate')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: ['ims_health.longest_lock', 'ims_health.highest_r0_time'],
    labels: [t('in-forge:plugins.zIms.longestLock'), t('in-forge:plugins.zIms.highestR0Time')],
    min: 0,
    formatter: micros.compact
  },
  {
    metrics: [
      getDynamicMetricMatch('address_spaces', 'cpu_time', t('in-forge:plugins.zIms.addressSpaces.cpuTime')),
      getDynamicMetricMatch(
        'dependent_region_statistics',
        'transaction_elapsed_time',
        t('in-forge:plugins.zIms.dependentRegion.transactionElapsedTime')
      )
    ],
    labels: [
      t('in-forge:plugins.zIms.addressSpaces.cpuTime'),
      t('in-forge:plugins.zIms.dependentRegion.transactionElapsedTime')
    ],
    min: 0,
    formatter: micros.detailed
  },
  {
    metrics: [
      getDynamicMetricMatch('address_spaces', 'cpu_percentage', t('in-forge:plugins.zIms.addressSpaces.cpuPercentage')),
      getDynamicMetricMatch(
        'sub_pool_statistics',
        'subpool_hit_ratio',
        t('in-forge:plugins.zIms.subpoolStatistics.subpoolHitRatio')
      ),
      getDynamicMetricMatch(
        'vsam_sub_pools',
        'subpool_hit_ratio',
        t('in-forge:plugins.zIms.vsamSubpools.subPoolHitRatio')
      ),
      getDynamicMetricMatch(
        'dependent_region_statistics',
        'region_occupancy_percentage',
        t('in-forge:plugins.zIms.dependentRegion.regionOccupancyPercentage')
      )
    ],
    labels: [
      t('in-forge:plugins.zIms.addressSpaces.cpuPercentage'),
      t('in-forge:plugins.zIms.subpoolStatistics.subpoolHitRatio'),
      t('in-forge:plugins.zIms.vsamSubpools.subPoolHitRatio'),
      t('in-forge:plugins.zIms.dependentRegion.regionOccupancyPercentage')
    ],
    min: 0,
    formatter: percentagePlainZeroDecimalPlaces
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'address_spaces',
        'working_set_size',
        t('in-forge:plugins.zIms.addressSpaces.workingSetSize')
      ),
      getDynamicMetricMatch('address_spaces', 'excp_rate', t('in-forge:plugins.zIms.addressSpaces.excpRate')),
      getDynamicMetricMatch(
        'address_spaces',
        'common_page_in_rate',
        t('in-forge:plugins.zIms.addressSpaces.commonPageInRate')
      ),
      getDynamicMetricMatch(
        'address_spaces',
        'private_page_in_rate',
        t('in-forge:plugins.zIms.addressSpaces.privatePageInRate')
      )
    ],
    labels: [
      t('in-forge:plugins.zIms.addressSpaces.workingSetSize'),
      t('in-forge:plugins.zIms.addressSpaces.excpRate'),
      t('in-forge:plugins.zIms.addressSpaces.commonPageInRate'),
      t('in-forge:plugins.zIms.addressSpaces.privatePageInRate')
    ],
    min: 0,
    formatter: number.short
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'sub_pool_statistics',
        'buffer_count',
        t('in-forge:plugins.zIms.subpoolStatistics.bufferCount')
      ),
      getDynamicMetricMatch('pool_utilization', 'free_blocks', t('in-forge:plugins.zIms.poolUtilization.freeBlocks')),
      getDynamicMetricMatch(
        'dependent_region_statistics',
        'external_subsystem_calls',
        t('in-forge:plugins.zIms.dependentRegion.externalSubsystemCalls')
      ),
      getDynamicMetricMatch(
        'dependent_region_statistics',
        'locks_held_count',
        t('in-forge:plugins.zIms.dependentRegion.locksHeldCount')
      )
    ],
    labels: [
      t('in-forge:plugins.zIms.subpoolStatistics.bufferCount'),
      t('in-forge:plugins.zIms.poolUtilization.freeBlocks'),
      t('in-forge:plugins.zIms.dependentRegion.externalSubsystemCalls'),
      t('in-forge:plugins.zIms.dependentRegion.locksHeldCount')
    ],
    min: 0,
    formatter: number.compact
  },
  {
    metrics: [
      getDynamicMetricMatch(
        'sub_pool_statistics',
        'buffer_size',
        t('in-forge:plugins.zIms.subpoolStatistics.bufferSize')
      ),
      getDynamicMetricMatch(
        'sub_pool_statistics',
        'total_storage',
        t('in-forge:plugins.zIms.subpoolStatistics.totalStorage')
      ),
      getDynamicMetricMatch('vsam_sub_pools', 'buffer_size', t('in-forge:plugins.zIms.vsamSubpools.bufferSize')),
      getDynamicMetricMatch('pool_utilization', 'pool_size', t('in-forge:plugins.zIms.poolUtilization.poolSize')),
      getDynamicMetricMatch('pool_utilization', 'free_space', t('in-forge:plugins.zIms.poolUtilization.freeSpace')),
      getDynamicMetricMatch(
        'pool_utilization',
        'largest_free_block',
        t('in-forge:plugins.zIms.poolUtilization.largestFreeBlock')
      ),
      getDynamicMetricMatch(
        'pool_utilization',
        'current_storage_used',
        t('in-forge:plugins.zIms.poolUtilization.currentStorageUsed')
      )
    ],
    labels: [
      t('in-forge:plugins.zIms.subpoolStatistics.bufferSize'),
      t('in-forge:plugins.zIms.subpoolStatistics.totalStorage'),
      t('in-forge:plugins.zIms.vsamSubpools.bufferSize'),
      t('in-forge:plugins.zIms.poolUtilization.poolSize'),
      t('in-forge:plugins.zIms.poolUtilization.freeSpace'),
      t('in-forge:plugins.zIms.poolUtilization.largestFreeBlock'),
      t('in-forge:plugins.zIms.poolUtilization.currentStorageUsed')
    ],
    min: 0,
    formatter: bytes.compact
  }
];

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'nomad.client.allocated.cpu',
      'nomad.client.allocated.disk',
      'nomad.client.allocated.iops',
      'nomad.client.allocated.memory',
      'nomad.client.allocations.blocked',
      'nomad.client.allocations.migrating',
      'nomad.client.allocations.pending',
      'nomad.client.allocations.running',
      'nomad.client.allocations.terminal',
      'nomad.client.unallocated.cpu',
      'nomad.client.unallocated.disk',
      'nomad.client.unallocated.iops',
      'nomad.client.unallocated.memory',
      'nomad.nomad.blocked_evals.total_blocked',
      'nomad.nomad.blocked_evals.total_escaped',
      'nomad.nomad.blocked_evals.total_quota_limit',
      'nomad.nomad.broker._core.ready',
      'nomad.nomad.broker._core.unacked',
      'nomad.nomad.broker.total_blocked',
      'nomad.nomad.broker.total_ready',
      'nomad.nomad.broker.total_unacked',
      'nomad.nomad.broker.total_waiting',
      'nomad.nomad.heartbeat.active',
      'nomad.nomad.plan.queue_depth',
      'nomad.nomad.vault.distributed_tokens_revoking',
      'nomad.runtime.alloc_bytes',
      'nomad.runtime.free_count',
      'nomad.runtime.heap_objects',
      'nomad.runtime.malloc_count',
      'nomad.runtime.num_goroutines',
      'nomad.runtime.sys_bytes',
      'nomad.runtime.total_gc_pause_ns',
      'nomad.runtime.total_gc_runs',
      'nomad.uptime'
    ],
    labels: [
      t('in-forge:plugins.nomadScheduler.totalAmountOfCpuSharesTheSchedulerHasAllocatedToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfDiskSpaceTheSchedulerHasAllocatedToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfIopsTheSchedulerHasAllocatedToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfMemoryTheSchedulerHasAllocatedToTasks'),
      t('in-forge:plugins.nomadScheduler.blockedAllocations'),
      t('in-forge:plugins.nomadScheduler.migratingAallocations'),
      t('in-forge:plugins.nomadScheduler.pendingAllocations'),
      t('in-forge:plugins.nomadScheduler.runningAallocations'),
      t('in-forge:plugins.nomadScheduler.terminatedAllocations'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfCpuSharesFreeForTheSchedulerToAllocateToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfDiskSpaceFreeForTheSchedulerToAllocateToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfIopsFreeForTheSchedulerToAllocateToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfMemoryFreeForTheSchedulerToAllocateToTasks'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfBlockedEvaluations'),
      t('in-forge:plugins.nomadScheduler.totalAmountOfEscapedEvaluations'),
      t('in-forge:plugins.nomadScheduler.totalQuotaLimitForBlockedEvaluations'),
      t('in-forge:plugins.nomadScheduler.brokerCoreReady'),
      t('in-forge:plugins.nomadScheduler.brokerCoreUnacknowledged'),
      t('in-forge:plugins.nomadScheduler.brokerTotalBlocked'),
      t('in-forge:plugins.nomadScheduler.brokerTotalReady'),
      t('in-forge:plugins.nomadScheduler.brokerTotalUnacknowledged'),
      t('in-forge:plugins.nomadScheduler.brokerTotalWaiting'),
      t('in-forge:plugins.nomadScheduler.heartbeatActive'),
      t('in-forge:plugins.nomadScheduler.nomadPlanQueueDepth'),
      t('in-forge:plugins.nomadScheduler.nomadVaultDistributedTokensRevoking'),
      t('in-forge:plugins.nomadScheduler.runtimeAllocatedBytes'),
      t('in-forge:plugins.nomadScheduler.runtimeFreeCount'),
      t('in-forge:plugins.nomadScheduler.runtimeHeapObjects'),
      t('in-forge:plugins.nomadScheduler.runtimeMallocCount'),
      t('in-forge:plugins.nomadScheduler.runtimeNumberOfGoRoutines'),
      t('in-forge:plugins.nomadScheduler.runtimeSystemBytes'),
      t('in-forge:plugins.nomadScheduler.runtimeTotalAmountOfGcPauseInNs'),
      t('in-forge:plugins.nomadScheduler.runtimeTotalAmountOfGcRuns'),
      t('in-forge:plugins.nomadScheduler.uptime')
    ],
    min: 0,
    category: [t('in-forge:plugins.nomadScheduler.nomad')],
    formatter: number
  }
];

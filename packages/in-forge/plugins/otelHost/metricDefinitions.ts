/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  zeroDecimalPlaces,
  percentage,
  number,
  bytes,
  bytesPerSecondZeroDecimalPlaces,
  millisPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error Could not find a declaration file for module
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['load.avg_1m'],
    labels: [t('in-forge:plugins.otelHost.cpu_load_1m')],
    category: [t('in-forge:plugins.otelHost.label_category_Load')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['load.avg_5m'],
    labels: [t('in-forge:plugins.otelHost.cpu_load_5m')],
    category: [t('in-forge:plugins.otelHost.label_category_Load')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['load.avg_15m'],
    labels: [t('in-forge:plugins.otelHost.cpu_load_15m')],
    category: [t('in-forge:plugins.otelHost.label_category_Load')],
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['cpu.user'],
    labels: [t('in-forge:plugins.otelHost.cpu_user')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.system'],
    labels: [t('in-forge:plugins.otelHost.cpu_system')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.idle'],
    labels: [t('in-forge:plugins.otelHost.cpu_idle')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.wait'],
    labels: [t('in-forge:plugins.otelHost.cpu_wait')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.nice'],
    labels: [t('in-forge:plugins.otelHost.cpu_nice')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.steal'],
    labels: [t('in-forge:plugins.otelHost.cpu_steal')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.interrupt'],
    labels: [t('in-forge:plugins.otelHost.cpu_interrupt')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metrics: ['cpu.softirq'],
    labels: [t('in-forge:plugins.otelHost.cpu_softirq')],
    category: [t('in-forge:plugins.otelHost.label_category_CPU')],
    min: 0,
    max: 1,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'user', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_user'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'system', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_system'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'idle', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_idle'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'wait', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_wait'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'nice', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_nice'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'steal', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_steal'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'interrupt', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_interrupt'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('cpus', 'softirq', 'CPU Core'),
    label: t('in-forge:plugins.otelHost.cpu_softirq'),
    min: 0,
    max: 1,
    category: [t('in-forge:plugins.otelHost.label_category_CPUs')],
    formatter: percentage
  },
  {
    metrics: ['memory.used'],
    labels: [t('in-forge:plugins.otelHost.memory_used')],
    category: [t('in-forge:plugins.otelHost.label_category_Memory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['memory.free'],
    labels: [t('in-forge:plugins.otelHost.memory_free')],
    category: [t('in-forge:plugins.otelHost.label_category_Memory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['memory.buffered'],
    labels: [t('in-forge:plugins.otelHost.memory_buffered')],
    category: [t('in-forge:plugins.otelHost.label_category_Memory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['memory.cached'],
    labels: [t('in-forge:plugins.otelHost.memory_cached')],
    category: [t('in-forge:plugins.otelHost.label_category_Memory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['memory.slab_reclaimable'],
    labels: [t('in-forge:plugins.otelHost.memory_slab_reclaimable')],
    category: [t('in-forge:plugins.otelHost.label_category_Memory')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['memory.slab_unreclaimable'],
    labels: [t('in-forge:plugins.otelHost.memory_slab_unreclaimable')],
    category: [t('in-forge:plugins.otelHost.label_category_Memory')],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('disks', 'io_read', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_io_read'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'io_write', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_io_write'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'io_tim', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_io_tim'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: millisPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'merged_read', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_merged_read'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'merged_write', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_merged_write'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'oper_tim_read', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_oper_tim_read'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: millisPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'oper_tim_write', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_oper_tim_write'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: millisPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'oper_read', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_oper_read'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'oper_write', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_oper_write'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('disks', 'oper_pending', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_oper_pending'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('disks', 'io_tim_weighted', 'Disk'),
    label: t('in-forge:plugins.otelHost.disk_io_tim_weighted'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Disk')],
    formatter: millisPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'inode_used', 'File System'),
    label: t('in-forge:plugins.otelHost.filesystem_inode_used'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Filesystem')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'inode_free', 'File System'),
    label: t('in-forge:plugins.otelHost.filesystem_inode_free'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Filesystem')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'bytes_used', 'File System'),
    label: t('in-forge:plugins.otelHost.filesystem_bytes_used'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Filesystem')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'bytes_free', 'File System'),
    label: t('in-forge:plugins.otelHost.filesystem_bytes_free'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Filesystem')],
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('filesystems', 'bytes_reserved', 'File System'),
    label: t('in-forge:plugins.otelHost.filesystem_bytes_reserved'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Filesystem')],
    formatter: bytes
  },
  {
    metrics: ['processes.zombies', 'processes.blocked', 'processes.running', 'processes.unknown', 'processes.sleeping'],
    labels: [
      t('in-forge:plugins.otelHost.processes_zombies'),
      t('in-forge:plugins.otelHost.processes_blocked'),
      t('in-forge:plugins.otelHost.processes_running'),
      t('in-forge:plugins.otelHost.processes_unknown'),
      t('in-forge:plugins.otelHost.processes_sleeping')
    ],
    category: [t('in-forge:plugins.otelHost.label_category_Process')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['processes.created'],
    labels: [t('in-forge:plugins.otelHost.processes_created')],
    category: [t('in-forge:plugins.otelHost.label_category_Process')],
    min: 0,
    formatter: millisPerSecondZeroDecimalPlaces
    //   },
    //   {
    //     metric: ['paging.usage_used'],
    //     label: t('in-forge:plugins.otelHost.paging_usage_used'),
    //     category: [t('in-forge:plugins.otelHost.label_category_Paging')],
    //     min: 0,
    //     formatter: number
    //   },
    //   {
    //     metric: ['paging.usage_free'],
    //     label: t('in-forge:plugins.otelHost.paging_usage_free'),
    //     category: [t('in-forge:plugins.otelHost.label_category_Paging')],
    //     min: 0,
    //     formatter: number
  },
  {
    metrics: [
      'paging.faults_major',
      'paging.faults_minor',
      'paging.page_in_major',
      'paging.page_in_minor',
      'paging.page_out_major',
      'paging.page_out_minor'
    ],
    labels: [
      t('in-forge:plugins.otelHost.paging_faults_major'),
      t('in-forge:plugins.otelHost.paging_faults_minor'),
      t('in-forge:plugins.otelHost.paging_page_in_major'),
      t('in-forge:plugins.otelHost.paging_page_in_minor'),
      t('in-forge:plugins.otelHost.paging_page_out_major'),
      t('in-forge:plugins.otelHost.paging_page_out_minor')
    ],
    category: [t('in-forge:plugins.otelHost.label_category_Paging')],
    min: 0,
    formatter: millisPerSecondZeroDecimalPlaces
  },

  {
    metric: getDynamicMetricMatch('network', 'io_receive', 'Network'),
    label: t('in-forge:plugins.otelHost.network_io_receive'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Network')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metric: getDynamicMetricMatch('network', 'io_transmit', 'Network'),
    label: t('in-forge:plugins.otelHost.network_io_transmit'),
    min: 0,
    category: [t('in-forge:plugins.otelHost.label_category_Network')],
    formatter: bytesPerSecondZeroDecimalPlaces
  },
  {
    metrics: [
      'tcp.listen',
      'tcp.established',
      'tcp.syn_sent',
      'tcp.syn_recv',
      'tcp.fin_wait_1',
      'tcp.fin_wait_2',
      'tcp.last_ack',
      'tcp.time_wait',
      'tcp.close',
      'tcp.close_wait',
      'tcp.closing',
      'tcp.delete'
    ],
    labels: [
      t('in-forge:plugins.otelHost.tcp_listen'),
      t('in-forge:plugins.otelHost.tcp_established'),
      t('in-forge:plugins.otelHost.tcp_syn_sent'),
      t('in-forge:plugins.otelHost.tcp_syn_recv'),
      t('in-forge:plugins.otelHost.tcp_fin_wait_1'),
      t('in-forge:plugins.otelHost.tcp_fin_wait_2'),
      t('in-forge:plugins.otelHost.tcp_last_ack'),
      t('in-forge:plugins.otelHost.tcp_time_wait'),
      t('in-forge:plugins.otelHost.tcp_close'),
      t('in-forge:plugins.otelHost.tcp_close_wait'),
      t('in-forge:plugins.otelHost.tcp_closing'),
      t('in-forge:plugins.otelHost.tcp_delete')
    ],
    category: [t('in-forge:plugins.otelHost.label_category_TCP')],
    min: 0,
    formatter: number
  }
];

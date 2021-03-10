/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, percentage } from 'in-services/formatters/number';
import { getDynamicMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metric: getDynamicMetricMatch('members', 'disk_io_utilization_percent_average_5m', 'Disk'),
    label: 'Disk Average IO Percent Utilization(5m)',
    category: ['Disk'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_iops_read_write_total', 'Disk'),
    label: 'Disk IOPS R/W Total',
    category: ['Disk'],
    min: 0,
    formatter: number
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_total_bytes', 'Disk'),
    label: 'Disk Total Bytes',
    category: ['Disk'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_bytes', 'Disk'),
    label: 'Disk Used Bytes',
    category: ['Disk'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'disk_used_percent', 'Disk'),
    label: 'Disk Used Percent',
    category: ['Disk'],
    min: 0,
    formatter: percentage
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_limit_bytes', 'Memory'),
    label: 'Memory Limit Bytes',
    category: ['Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_bytes', 'Memory'),
    label: 'Memory Used Bytes',
    category: ['Memory'],
    min: 0,
    formatter: bytes
  },
  {
    metric: getDynamicMetricMatch('members', 'memory_used_percent', 'Memory'),
    label: 'Memory Used Percent',
    category: ['Memory'],
    min: 0,
    formatter: percentage
  }
];

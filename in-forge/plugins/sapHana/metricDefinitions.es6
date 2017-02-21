import {
  number,
  bytes,
  percentage
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'stats.usedMemory',
      'stats.residentMemory'
    ],
    labels: [
      'Used Memory',
      'Resident Memory'
    ],
    formatter: number,
    min: 0
  },
  {
    formatter: percentage,
    metrics: [
      'stats.cpuUsage'
    ],
    labels: [
      'Cpu Usage'
    ],
    min: 0
  },
  {
    formatter: bytes,
    metrics: [
      'stats.diskUsageData',
      'stats.diskUsageLog',
      'stats.diskUsageTrace'
    ],
    labels: [
      'Data Size',
      'Log Size',
      'Trace Size'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.idleConnectionCount',
      'stats.runningConnectionCount'
    ],
    labels: [
      'Idle',
      'Running'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.totalCount',
      'stats.activeCount',
      'stats.blockedCount'
    ],
    labels: [
      'Total',
      'Active',
      'Blocked'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.jobWorkerCount',
      'stats.jobWorkerActiveCount',
      'stats.jobWorkerBlockedCount'
    ],
    labels: [
      'Total',
      'Active',
      'Blocked'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.sqlExecutorCount',
      'stats.sqlExecutorActiveCount',
      'stats.sqlExecutorBlockedCount'
    ],
    labels: [
      'Total',
      'Active',
      'Blocked'
    ],
    min: 0
  }
];

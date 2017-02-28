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
      'stats.sessionsTotalCount',
      'stats.sessionsIdleCount',
      'stats.sessionsRunningCount',
      'stats.sessionsBlockedCount',
      'stats.sessionsBlockingCount'
    ],
    labels: [
      'Total',
      'Idle',
      'Running',
      'Blocked',
      'Blocking'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.sessionsDatabaseUsers',
      'stats.sessionsApplications',
      'stats.sessionsApplicationUsers'
    ],
    labels: [
      'Database Users',
      'Running',
      'Application Users'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.threadsTotalCount',
      'stats.threadsActiveCount',
      'stats.threadsBlockedCount'
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
      'stats.threadsJobWorkerCount',
      'stats.threadsJobWorkerActiveCount',
      'stats.threadsJobWorkerBlockedCount'
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
      'stats.threadsSqlExecutorCount',
      'stats.threadsSqlExecutorActiveCount',
      'stats.threadsSqlExecutorBlockedCount'
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
      'stats.stmtExecutions',
      'stats.stmtCompilations',
      'stats.updateTransactions',
      'stats.rollbacks',
      'stats.commits'
    ],
    labels: [
      'Statement Executions',
      'Statement Compilations',
      'Update Transactions',
      'Rollbacks',
      'Commits'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.indexServerFinishedRequests',
      'stats.indexServerActiveRequests',
      'stats.indexServerPendingRequests'
    ],
    labels: [
      'Finished Requests',
      'Active Requests',
      'Pending Requests'
    ],
    min: 0
  }
];

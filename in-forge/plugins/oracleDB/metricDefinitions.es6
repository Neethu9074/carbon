import {
  number,
  muSecondsToMillis,
  hitRate,
  percentage,
  bytes
} from 'in-services/formatters/number';
import {getMetricMatch} from 'in-sdk/metrics/metricDefinitions';

import {
  percentage100,
  centiSecondsToMillis
} from './numberFormatter.es6';


export default [
  {
    metrics: [
      'stats.dbTime',
      'stats.cpuTime',
      'stats.sqlExecuteTime',
      'stats.parseTime'
    ],
    labels: [
      'DB Time',
      'DB CPU Time',
      'SQL Execute Time',
      'Parse Time'
    ],
    formatter: muSecondsToMillis,
    min: 0
  },
  {
    max: 1,
    formatter: hitRate,
    metrics: [
      'stats.cpuTimeDbTimeRatio'
    ],
    labels: [
      'DB CPU Time/DB Time Ratio'
    ],
    min: 0
  },
  {
    formatter: centiSecondsToMillis,
    metrics: [
      'stats.timeWaited.userIO',
      'stats.timeWaited.other',
      'stats.timeWaited.systemIO',
      'stats.timeWaited.concurrency',
      'stats.timeWaited.scheduler',
      'stats.timeWaited.application',
      'stats.timeWaited.commit',
      'stats.timeWaited.configuration',
      'stats.timeWaited.administrative',
      'stats.timeWaited.network',
      'stats.timeWaited.queue'
    ],
    labels: [
      'User I/O',
      'Other',
      'System I/O',
      'Concurrency',
      'Scheduler',
      'Application',
      'Commit',
      'Configuration',
      'Administrative',
      'Network',
      'Queueing'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.sqlExecuteCount'
    ],
    labels: [
      'Sql Execute Count'
    ],
    min: 0
  },
  {
    formatter: muSecondsToMillis,
    metrics: [
      'stats.averageSqlExecuteTime'
    ],
    labels: [
      'Average Sql Execution Time'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.hardParseCount',
      'stats.totalParseCount'
    ],
    labels: [
      'Hard Parse Count',
      'Total Parse Count'
    ],
    min: 0
  },
  {
    max: 1,
    formatter: hitRate,
    metrics: [
      'stats.softTotalParsesRatio',
      'stats.executesWithoutParsesRatio'
    ],
    labels: [
      'Soft/Total Parse Ratio',
      'Executes Without Parses Ratio'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.userCalls',
      'stats.recursiveCalls',
      'stats.userCommits',
      'stats.userRollbacks',
      'stats.userLogOns'
    ],
    labels: [
      'User Calls',
      'Recursive Calls',
      'User Commits',
      'User Rollbacks',
      'User Log Ons'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.physicalReads',
      'stats.sessionLogicalReads'
    ],
    labels: [
      'Physical Reads',
      'Session Logical Reads'
    ],
    min: 0
  },
  {
    max: 1,
    formatter: hitRate,
    metrics: [
      'stats.bufferCacheHitRatio'
    ],
    labels: [
      'Buffer Cache Hit Ratio'
    ],
    min: 0
  },
  {
    formatter: number,
    metrics: [
      'stats.activeUserSessions',
      'stats.inactiveUserSessions',
      'stats.backgroundSessions'
    ],
    labels: [
      'Active User Sessions',
      'Inactive User Sessions',
      'Background Sessions'
    ],
    min: 0
  },
  {
    max: 1,
    formatter: percentage,
    metrics: [
      'stats.usedSessionsRatio'
    ],
    labels: [
      'Sessions/Session Limit'
    ],
    min: 0
  },
  {
    formatter: bytes,
    metric: getMetricMatch('stats.tablespaceStats', 'usedSpace'),
    labels: [
      'Used Space'
    ],
    min: 0
  },
  {
    formatter: percentage100,
    metric: getMetricMatch('stats.tablespaceStats', 'usedPercent'),
    labels: [
      'Used Percent'
    ],
    min: 0,
    max: 100
  }
];

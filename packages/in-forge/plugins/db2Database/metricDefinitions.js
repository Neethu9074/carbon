import { number, bytes, millis } from 'in-services/formatters/number';
import { getMetricMatch } from 'in-sdk/metrics/metricDefinitions';

export default [
  {
    metrics: [
      'databases.status',
      'databases.queries',
      'databases.connectionsCount',
      'databases.rowsRead',
      'databases.rowsReturned',
      'databases.commits',
      'databases.rollbacks',
      'databases.selectQueries',
      'databases.mergeQueries',
      'databases.ddlQueries',
      'databases.uidQueries',
      'databases.xQueries',
      'databases.staticQueries',
      'databases.dynamicQueries',
      'databases.failedQueries'
    ],
    labels: [
      'Status',
      'All Queries',
      'Connection Count',
      'Rows Read',
      'Rows Returned',
      'Commits',
      'Rollbacks',
      'SELECTS',
      'MERGES',
      'DDLS',
      'UIDS',
      'XQUERIES',
      'Static Queries',
      'Dynamic Queries',
      'Failed Queries'
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'bufferpools.dataWrites',
      'bufferpools.dataPhysicalReads',
      'bufferpools.dataLogicalReads',
      'bufferpools.temporaryDataPhysicalReads',
      'bufferpools.temporaryDataLogicalReads'
    ],
    labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
    min: 0,
    formatter: number,
    category: ['Buffer Pool Data Pages']
  },
  {
    metrics: [
      'bufferpools.indexWrites',
      'bufferpools.indexPhysicalReads',
      'bufferpools.indexLogicalReads',
      'bufferpools.temporaryIndexPhysicalRead',
      'bufferpools.temporaryIndexLogicalReads'
    ],
    labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
    min: 0,
    formatter: number,
    category: ['Buffer Pool Index Pages']
  },
  {
    metrics: [
      'bufferpools.xdaDataWrites',
      'bufferpools.xdaDataPhysicalReads',
      'bufferpools.xdaDataLogicalReads',
      'bufferpools.temporaryXdaDataPhysicalReads',
      'bufferpools.temporaryXdaDataLogicalReads'
    ],
    labels: ['Physical Writes', 'Physical Reads', 'Logical Reads', 'Temp Physical Reads', 'Temp Logical Reads'],
    min: 0,
    formatter: number,
    category: ['Buffer Pool XDA']
  },
  {
    metrics: ['bufferpools.physicalReadTime', 'bufferpools.physicalWriteTime'],
    labels: ['Buffer Pool Read Time', 'Buffer Pool Write Time'],
    min: 0,
    formatter: millis,
    category: ['Buffer Pool Time']
  },
  {
    metrics: ['logs.available', 'logs.used'],
    labels: ['Logs Available', 'Logs Used'],
    min: 0,
    formatter: bytes,
    category: ['Log Space']
  },
  {
    metrics: ['logs.readsIO', 'logs.writesIO'],
    labels: ['Log IO Reads', 'Log IO Writes'],
    min: 0,
    formatter: number,
    category: ['Log IO']
  },
  {
    metrics: ['logs.reads', 'logs.writes'],
    labels: ['Log Reads', 'Log Writes'],
    min: 0,
    formatter: number,
    category: ['Log']
  },
  {
    metrics: [getMetricMatch('containers', 'totalSize'), getMetricMatch('containers', 'usedSize')],
    labels: ['File System Size', 'File System Used'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: [getMetricMatch('containers', 'pagesRead'), getMetricMatch('containers', 'pagesWritten')],
    labels: ['Pages Read', 'Pages Written'],
    min: 0,
    formatter: number
  },
  {
    metrics: [getMetricMatch('containers', 'poolReadTime'), getMetricMatch('containers', 'poolWriteTime')],
    labels: ['Pool Read Time', 'Pool Write Time'],
    min: 0,
    formatter: millis
  }
];

import { bytes, number, timeByMillisTwoDecimalPlaces } from 'in-services/formatters/number';

export default [
  {
    metrics: ['metrics.ru_utime', 'metrics.ru_stime'],
    labels: ['Time Spent In User Mode', 'Time Spent In System Mode'],
    min: 0,
    formatter: timeByMillisTwoDecimalPlaces
  },
  {
    metrics: ['metrics.ru_ixrss', 'metrics.ru_idrss', 'metrics.ru_maxrss', 'metrics.ru_isrss'],
    labels: ['Shared Memory Size', 'Unshared Memory Size', 'Maximum Resident Set Size', 'Unshare Stack Size'],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['metrics.ru_minflt', 'metrics.ru_majflt', 'metrics.ru_nswap'],
    labels: ['Page Faults Requiring I/O', 'Page Faults Not Requiring I/O', 'Swap Outs'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.ru_inblock', 'metrics.ru_oublock'],
    labels: ['Block Input Operations', 'Block Output Operations'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.ru_msgsnd', 'metrics.ru_msgrcv', 'metrics.ru_nsignals'],
    labels: ['Messages Sent', 'Messages Received', 'Signals Received'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.ru_nvcsw', 'metrics.ru_nivcsw'],
    labels: ['Voluntary Context Switches', 'Involuntary Context Switches'],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'metrics.rgc.collect0',
      'metrics.rgc.collect1',
      'metrics.rgc.collect2',
      'metrics.rgc.threshold0',
      'metrics.rgc.threshold1',
      'metrics.rgc.threshold2'
    ],
    labels: ['Collect 0', 'Collect 1', 'Collect 2', 'Threshold 0', 'Threshold 1', 'Threshold 2'],
    min: 0,
    formatter: number
  },
  {
    metrics: ['metrics.alive_threads', 'metrics.dead_threads', 'metrics.daemon_threads'],
    labels: ['Alive Threads', 'Dead Threads', 'Daemon Threads'],
    min: 0,
    formatter: number
  }
];

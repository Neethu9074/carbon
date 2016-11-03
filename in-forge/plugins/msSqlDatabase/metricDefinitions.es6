import {
  number
} from 'in-services/formatters/number';


export default [
  {
    metrics: [
      'waitstats.PAGEIOLATCH_EX.wait_time_ms',
      'waitstats.PAGEIOLATCH_SH.wait_time_ms',
      'waitstats.ASYNC_NETWORK_IO.wait_time_ms',
      'waitstats.CXPACKET.wait_time_ms',
      'waitstats.WRITELOG.wait_time_ms'
    ],
    labels: [
      'Page IO-Latch EX',
      'Page IO-Latch SH',
      'Async Network IO',
      'CX-Packet',
      'Writelog'
    ],
    min: 0,
    category: ['Wait Times'],
    formatter: number
  },
  {
    metrics: [
      'perfcounters.sqlserver:general statistics\\logins\/sec',
      'perfcounters.sqlserver:general statistics\\user connections'
    ],
    labels: [
      'Logins/sec.',
      'Connections'
    ],
    min: 0,
    formatter: number
  }
];

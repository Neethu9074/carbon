import { bytes, time } from 'in-services/formatters/number';

export default [
  {
    label: 'GC Pause',
    metric: 'gc.gcPause',
    formatter: time
  },
  {
    label: 'RSS',
    metric: 'memory.rss',
    formatter: bytes.detailed
  }
];

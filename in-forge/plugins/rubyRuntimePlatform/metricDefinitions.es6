import {
  kiloBytes,
  number,
  millis
} from 'in-services/formatters/number';


export default [
  {
    metric: 'memory.rss_size',
    label: 'Resident',
    min: 0,
    category: ['Memory'],
    formatter: kiloBytes
  },
  {
    metrics: [
      'gc.heap_live',
      'gc.heap_free'
    ],
    labels: [
      'Live',
      'Free'
    ],
    min: 0,
    category: ['Heap Slots'],
    formatter: number
  },
  {
    metrics: [
      'gc.minorGcs',
      'gc.majorGcs'
    ],
    labels: [
      '#Minor GCs',
      '#Major GCs'
    ],
    min: 0,
    category: ['GC'],
    formatter: number
  },
  {
    metric: 'gc.totalTime',
    label: '#GC Run Duration',
    min: 0,
    category: ['GC'],
    formatter: millis
  },
  {
    metric: 'thread.count',
    label: '#Thread Count',
    min: 0,
    category: ['Threads'],
    formatter: number
  }
];

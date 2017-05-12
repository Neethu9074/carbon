import { number } from 'in-services/formatters/number';

export default [
  {
    metrics: ['gc.tb', 'gc.fb'],
    labels: ['Total', 'Free'],
    min: 0,
    category: ['Heap'],
    formatter: number
  },
  {
    metric: 'thread.count',
    label: '#Thread Count',
    min: 0,
    category: ['Threads'],
    formatter: number
  }
];

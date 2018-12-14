import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'rs_store_count',
    label: 'Stores count',
    formatter: number
  },
  {
    metric: 'rs_store_file_count',
    label: 'Stores files count',
    formatter: number
  },
  {
    metric: 'rs_comp_queue_length',
    label: 'Compaction queue length',
    formatter: number
  },
  {
    metric: 'rs_flush_queue_length',
    label: 'Flush queue length',
    formatter: number
  }
];

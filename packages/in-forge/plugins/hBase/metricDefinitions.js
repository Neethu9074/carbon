/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
    metric: 'rs_blk_cache_hit_rate',
    label: 'Block cache hit rate',
    formatter: number.perSecond
  },
  {
    metric: 'rs_blk_cache_hit_count',
    label: 'Block cache hit count',
    formatter: number
  },
  {
    metric: 'rs_flush_queue_length',
    label: 'Flush queue length',
    formatter: number
  }
];

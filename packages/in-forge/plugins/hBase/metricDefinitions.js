/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'rs_store_count',
    label: t('in-forge:plugins.hBase.storesCount'),
    formatter: number
  },
  {
    metric: 'rs_store_file_count',
    label: t('in-forge:plugins.hBase.storesFilesCount'),
    formatter: number
  },
  {
    metric: 'rs_comp_queue_length',
    label: t('in-forge:plugins.hBase.compactionQueueLength'),
    formatter: number
  },
  {
    metric: 'rs_blk_cache_hit_rate',
    label: t('in-forge:plugins.hBase.blockCacheHitRate'),
    formatter: number.perSecond
  },
  {
    metric: 'rs_blk_cache_hit_count',
    label: t('in-forge:plugins.hBase.blockCacheHitCount'),
    formatter: number
  },
  {
    metric: 'rs_flush_queue_length',
    label: t('in-forge:plugins.hBase.flushQueueLength'),
    formatter: number
  }
];

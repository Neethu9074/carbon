/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { hitRate, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'sess_conn',
      'client_req',
      'sess_dropped',
      'cache_hit',
      'cache_miss',
      'cache_hitpass',
      'n_expired',
      'n_lru_nuked'
    ],
    labels: [
      t('in-forge:plugins.varnish.labelAcceptedClientConnections'),
      t('in-forge:plugins.varnish.labelAcceptedClientConnections'),
      t('in-forge:plugins.varnish.labelConnectionsDroppedFullQueue'),
      t('in-forge:plugins.varnish.labelCacheHits'),
      t('in-forge:plugins.varnish.labelCacheMisses'),
      t('in-forge:plugins.varnish.labelHitsPassFile'),
      t('in-forge:plugins.varnish.labelExpiredObjects'),
      t('in-forge:plugins.varnish.labelNukedObjects')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['cache_hit_rate'],
    labels: [t('in-forge:plugins.varnish.labelCacheHitRate')],
    min: 0,
    formatter: hitRate
  },
  {
    metrics: ['threads', 'threads_created', 'threads_failed', 'threads_limited', 'thread_queue_len', 'sess_queued'],
    labels: [
      t('in-forge:plugins.varnish.titleThreads'),
      t('in-forge:plugins.varnish.labelCreated'),
      t('in-forge:plugins.varnish.labelFailed'),
      t('in-forge:plugins.varnish.labelLimited'),
      t('in-forge:plugins.varnish.labelQueue'),
      t('in-forge:plugins.varnish.labelQueuedRequests')
    ],
    min: 0,
    category: [t('in-forge:plugins.varnish.titleThreads')],
    formatter: number
  },
  {
    metrics: [
      'backend_conn',
      'backend_recycle',
      'backend_reuse',
      'backend_fail',
      'backend_unhealthy',
      'backend_busy',
      'backend_req'
    ],
    labels: [
      t('in-forge:plugins.varnish.labelConnections'),
      t('in-forge:plugins.varnish.labelRecycled'),
      t('in-forge:plugins.varnish.labelReused'),
      t('in-forge:plugins.varnish.labelIdleClosed'),
      t('in-forge:plugins.varnish.labelUnhealthy'),
      t('in-forge:plugins.varnish.labelBusy'),
      t('in-forge:plugins.varnish.labelRequests')
    ],
    min: 0,
    category: [t('in-forge:plugins.varnish.titleBackend')],
    formatter: number
  }
];

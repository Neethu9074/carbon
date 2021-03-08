/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRate, number, millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'http_request_count',
      'http_error',
      'keep_alive_connections',
      'keep_alive_flushes',
      'keep_alive_hits',
      'keep_alive_refusals',
      'keep_alive_timeouts',
      'file_cache_hits',
      'file_cache_misses',
      'file_cache_info_hits',
      'file_cache_info_misses',
      'jdbc_connection_used',
      'jdbc_connection_free'
    ],
    labels: [
      t('in-forge:plugins.glassfishApplicationContainer.requests'),
      t('in-forge:plugins.glassfishApplicationContainer.errors'),
      t('in-forge:plugins.glassfishApplicationContainer.connections'),
      t('in-forge:plugins.glassfishApplicationContainer.flushes'),
      t('in-forge:plugins.glassfishApplicationContainer.hits'),
      t('in-forge:plugins.glassfishApplicationContainer.refusals'),
      t('in-forge:plugins.glassfishApplicationContainer.timeouts'),
      t('in-forge:plugins.glassfishApplicationContainer.hits'),
      t('in-forge:plugins.glassfishApplicationContainer.misses'),
      t('in-forge:plugins.glassfishApplicationContainer.infoHits'),
      t('in-forge:plugins.glassfishApplicationContainer.infoMisses'),
      t('in-forge:plugins.glassfishApplicationContainer.used'),
      t('in-forge:plugins.glassfishApplicationContainer.free')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'connections_open',
      'connections_overflows',
      'connections_queued',
      'connections_peak_queued',
      'connections_ticks_total_queued',
      'connections_total'
    ],
    labels: [
      t('in-forge:plugins.glassfishApplicationContainer.open'),
      t('in-forge:plugins.glassfishApplicationContainer.overflows'),
      t('in-forge:plugins.glassfishApplicationContainer.queued'),
      t('in-forge:plugins.glassfishApplicationContainer.peakQueued'),
      t('in-forge:plugins.glassfishApplicationContainer.ticksTotalQueued'),
      t('in-forge:plugins.glassfishApplicationContainer.total')
    ],
    min: 0,
    category: [t('in-forge:plugins.glassfishApplicationContainer.connections')],
    formatter: number
  },
  {
    metrics: ['http_max_time', 'http_proc_time'],
    labels: [
      t('in-forge:plugins.glassfishApplicationContainer.maxTime'),
      t('in-forge:plugins.glassfishApplicationContainer.processingTime')
    ],
    min: 0,
    formatter: millis
  },
  {
    metrics: ['file_cache_rate', 'file_cache_info_rate'],
    labels: [
      t('in-forge:plugins.glassfishApplicationContainer.hitRate'),
      t('in-forge:plugins.glassfishApplicationContainer.infoHitRate')
    ],
    min: 0,
    max: 1,
    formatter: hitRate
  }
];

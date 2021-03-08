/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { hitRate, number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['cmd_get', 'cmd_set'],
    labels: [t('in-forge:plugins.memcached.gets'), t('in-forge:plugins.memcached.sets')],
    min: 0,
    category: [t('in-forge:plugins.memcached.commands')],
    formatter: number
  },
  {
    metrics: ['bytes_read', 'bytes_write'],
    labels: [t('in-forge:plugins.memcached.readsBytes'), t('in-forge:plugins.memcached.writesBytes')],
    min: 0,
    formatter: bytes
  },
  {
    metrics: ['get_hits', 'get_misses', 'delete_hits', 'delete_misses', 'cmd_flush', 'evictions', 'bytes'],
    labels: [
      t('in-forge:plugins.memcached.getHits'),
      t('in-forge:plugins.memcached.getMisses'),
      t('in-forge:plugins.memcached.deleteHits'),
      t('in-forge:plugins.memcached.deleteMisses'),
      t('in-forge:plugins.memcached.flush'),
      t('in-forge:plugins.memcached.evictions'),
      t('in-forge:plugins.memcached.usedBytes')
    ],
    min: 0,
    formatter: number
  },
  {
    metrics: ['get_hit_rate', 'delete_hit_rate'],
    labels: [t('in-forge:plugins.memcached.getHitRatio'), t('in-forge:plugins.memcached.deleteHitRatio')],
    min: 0,
    formatter: hitRate
  },
  {
    metrics: ['conn_connected', 'conn_queued', 'conn_yields'],
    labels: [
      t('in-forge:plugins.memcached.connected'),
      t('in-forge:plugins.memcached.queued'),
      t('in-forge:plugins.memcached.yields')
    ],
    min: 0,
    category: [t('in-forge:plugins.memcached.connections')],
    formatter: number
  }
];

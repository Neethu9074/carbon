/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { percentage, number, bytes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: ['requests', 'kBytes'],
    labels: [t('in-forge:plugins.httpd.requests'), t('in-forge:plugins.httpd.kBytes')],
    min: 0,
    formatter: number
  },
  {
    metrics: ['conns_total', 'conns_async_writing', 'conns_async_keep_alive', 'conns_async_closing'],
    labels: [
      t('in-forge:plugins.httpd.connections'),
      t('in-forge:plugins.httpd.asyncConnectionsWriting'),
      t('in-forge:plugins.httpd.asyncConnectionsKeepAlive'),
      t('in-forge:plugins.httpd.asyncConnectionsClosing')
    ],
    min: 0,
    category: [t('in-forge:plugins.httpd.connections')],
    formatter: number
  },
  {
    metrics: [
      'worker.waiting',
      'worker.starting',
      'worker.reading',
      'worker.writing',
      'worker.keepalive',
      'worker.dns',
      'worker.closing',
      'worker.logging',
      'worker.graceful',
      'worker.idle'
    ],
    labels: [
      t('in-forge:plugins.httpd.waiting'),
      t('in-forge:plugins.httpd.starting'),
      t('in-forge:plugins.httpd.reading'),
      t('in-forge:plugins.httpd.writing'),
      t('in-forge:plugins.httpd.keepalive'),
      t('in-forge:plugins.httpd.dns'),
      t('in-forge:plugins.httpd.closing'),
      t('in-forge:plugins.httpd.logging'),
      t('in-forge:plugins.httpd.graceful'),
      t('in-forge:plugins.httpd.idle')
    ],
    min: 0,
    category: [t('in-forge:plugins.httpd.worker')],
    formatter: number
  },
  {
    metrics: ['cpu_load'],
    labels: [t('in-forge:plugins.httpd.cpuLoad')],
    min: 0,
    formatter: percentage
  },
  {
    metrics: ['bytes_per_req'],
    labels: [t('in-forge:plugins.httpd.trafficPerRequest')],
    min: 0,
    formatter: bytes
  },
  {
    metric: 'busy_workers',
    label: t('in-forge:plugins.httpd.busyWorkers'),
    formatter: number
  }
];

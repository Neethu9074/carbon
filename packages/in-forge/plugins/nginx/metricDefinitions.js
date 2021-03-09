/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'requests',
    label: t('in-forge:plugins.nginx.requestsS'),
    min: 0,
    formatter: number
  },
  {
    metrics: [
      'connections.accepted',
      'connections.handled',
      'connections.active',
      'connections.dropped',
      'connections.reading',
      'connections.writing',
      'connections.waiting',
      'nginx_plus.processes.respawned',
      'nginx_plus.http.upstreams.peers.failed',
      'nginx_plus.http.server_zones.5xx_responses',
      'nginx_plus.http.caches.miss.responses',
      'nginx_plus.http.caches.hit.responses',
      'nginx_plus.http.caches.size',
      'nginx_plus.http.caches.max_size',
      'nginx_plus.http.caches.cold',
      'nginx_plus.ssl.handshakes',
      'nginx_plus.ssl.handshakes_failed',
      'nginx_plus.ssl.session_reuses'
    ],
    labels: [
      t('in-forge:plugins.nginx.acceptedConnections'),
      t('in-forge:plugins.nginx.handledConnections'),
      t('in-forge:plugins.nginx.activeConnections'),
      t('in-forge:plugins.nginx.droppedConnections'),
      t('in-forge:plugins.nginx.reading'),
      t('in-forge:plugins.nginx.writing'),
      t('in-forge:plugins.nginx.waiting'),
      t('in-forge:plugins.nginx.processesRespawned'),
      t('in-forge:plugins.nginx.upstreamsFailed'),
      '5xx responses',
      'Miss responses',
      'Hit responses',
      'Caches size',
      'Max caches size',
      '# of cold caches',
      'Handshakes',
      'Failed hanshakes',
      'Session reuses'
    ],
    min: 0,
    category: [t('in-forge:plugins.nginx.connections')],
    formatter: number
  }
];

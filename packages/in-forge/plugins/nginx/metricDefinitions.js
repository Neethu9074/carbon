/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { number } from 'in-services/formatters/number';

export default [
  {
    metric: 'requests',
    label: 'Requests / s',
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
      'Accepted connections',
      'Handled connections',
      'Active connections',
      'Dropped connections',
      'Reading',
      'Writing',
      'Waiting',
      'Processes respawned',
      'Upstreams failed',
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
    category: ['Connections'],
    formatter: number
  }
];

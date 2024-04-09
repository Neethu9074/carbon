/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'status.THREADS_CONNECTED',
      'status.MAX_USED_CONNECTIONS',
      'status.ABORTED_CONNECTS',
      'status.SLOW_QUERIES',
      'status.KEY_READ_REQUESTS',
      'status.KEY_WRITE_REQUESTS',
      'status.KEY_READS',
      'status.KEY_WRITES',
      'status.ARIA_PAGECACHE_READS',
      'status.ARIA_PAGECACHE_WRITES'
    ],
    labels: [
      t('in-forge:plugins.mariaDbDatabase.connections'),
      t('in-forge:plugins.mariaDbDatabase.maxUsedConnections'),
      t('in-forge:plugins.mariaDbDatabase.abortedConnects'),
      t('in-forge:plugins.mariaDbDatabase.slowQueries'),
      t('in-forge:plugins.mariaDbDatabase.readRequests'),
      t('in-forge:plugins.mariaDbDatabase.writeRequests'),
      t('in-forge:plugins.mariaDbDatabase.reads'),
      t('in-forge:plugins.mariaDbDatabase.writes'),
      t('in-forge:plugins.mariaDbDatabase.pagecacheReads'),
      t('in-forge:plugins.mariaDbDatabase.pagecacheWrites')
    ],
    min: 0,
    formatter: number
  }
];

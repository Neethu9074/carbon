/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metrics: [
      'stats.lightweightDirectoryAccessProtocol.clientSessions',
      'stats.lightweightDirectoryAccessProtocol.busyRetries',
      'stats.lightweightDirectoryAccessProtocol.newConnectionsPerSec',
      'stats.lightweightDirectoryAccessProtocol.newSSLConnectionsPerSec',
      'stats.lightweightDirectoryAccessProtocol.closedConnectionsPerSec',
      'stats.lightweightDirectoryAccessProtocol.activeThreads',
      'stats.lightweightDirectoryAccessProtocol.threadsSleepingOnBusy',
      'stats.lightweightDirectoryAccessProtocol.addOperations',
      'stats.lightweightDirectoryAccessProtocol.deleteOperations',
      'stats.lightweightDirectoryAccessProtocol.modifyOperations',
      'stats.lightweightDirectoryAccessProtocol.modifyDNOperations',
      'stats.lightweightDirectoryAccessProtocol.addOperationsPerSec',
      'stats.lightweightDirectoryAccessProtocol.deleteOperationsPerSec',
      'stats.lightweightDirectoryAccessProtocol.modifyOperationsPerSec',
      'stats.lightweightDirectoryAccessProtocol.modifyDNOperationsPerSec',
      'stats.lightweightDirectoryAccessProtocol.writesPerSec',
      'stats.lightweightDirectoryAccessProtocol.SearchesPerSec',
      'stats.lightweightDirectoryAccessProtocol.udpOperationsPerSec',
      'stats.lightweightDirectoryAccessProtocol.batchSlotsAvailable'
    ],
    labels: [
      t('in-forge:plugins.activeDirectory.ldap.clientSessions'),
      t('in-forge:plugins.activeDirectory.ldap.busyretries'),
      t('in-forge:plugins.activeDirectory.ldap.connections'),
      t('in-forge:plugins.activeDirectory.ldap.sslConnections'),
      t('in-forge:plugins.activeDirectory.ldap.closedConnections'),
      t('in-forge:plugins.activeDirectory.ldap.active'),
      t('in-forge:plugins.activeDirectory.ldap.sleepingOnBusy'),
      t('in-forge:plugins.activeDirectory.ldap.add'),
      t('in-forge:plugins.activeDirectory.ldap.delete'),
      t('in-forge:plugins.activeDirectory.ldap.modify'),
      t('in-forge:plugins.activeDirectory.ldap.modifyDN'),
      t('in-forge:plugins.activeDirectory.ldap.add'),
      t('in-forge:plugins.activeDirectory.ldap.delete'),
      t('in-forge:plugins.activeDirectory.ldap.modify'),
      t('in-forge:plugins.activeDirectory.ldap.modifyDN'),
      t('in-forge:plugins.activeDirectory.ldap.write'),
      t('in-forge:plugins.activeDirectory.ldap.search'),
      t('in-forge:plugins.activeDirectory.ldap.udp'),
      t('in-forge:plugins.activeDirectory.ldap.availableBatchSlots')
    ],
    formatter: number.compact
  }
];

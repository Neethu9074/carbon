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
      'stats.lightweightDirectoryAccessProtocol.batchSlotsAvailable',
      'stats.addressBook.abAnrPerSec',
      'stats.addressBook.abBrowsesPerSec',
      'stats.addressBook.abClientSessions',
      'stats.addressBook.abMatchesPerSec',
      'stats.addressBook.abPropertyReadsPerSec',
      'stats.addressBook.abProxyLookupsPerSec',
      'stats.addressBook.abSearchesPerSec',

      'stats.directorySystemAgent.dsClientBindsPerSec',
      'stats.directorySystemAgent.dsClientNameTranslationsPerSec',
      'stats.directorySystemAgent.dsDirectoryReadsPerSec',
      'stats.directorySystemAgent.dsDirectorySearchesPerSec',
      'stats.directorySystemAgent.dsDirectoryWritesPerSec',

      'stats.directorySystemAgent.dsClientBindsPerSec',
      'stats.directorySystemAgent.dsClientNameTranslationsPerSec',
      'stats.directorySystemAgent.dsDirectoryReadsPerSec',
      'stats.directorySystemAgent.dsDirectorySearchesPerSec',
      'stats.directorySystemAgent.dsDirectoryWritesPerSec',

      'stats.directorySystemAgent.dsMonitorListSize',
      'stats.directorySystemAgent.dsNameCachehitRate',
      'stats.directorySystemAgent.dsNotifyQueueSize',
      'stats.directorySystemAgent.dsPercentReadsOther',
      'stats.directorySystemAgent.dsPercentWritesOther',
      'stats.directorySystemAgent.dsPercentSearchesOther',
      'stats.directorySystemAgent.dsSearchSubOperationsPerSec',

      'stats.directorySystemAgent.dsPercentReadsFromDRA',
      'stats.directorySystemAgent.dsPercentReadsFromNTDSAPI',
      'stats.directorySystemAgent.dsPercentReadsFromSAM',

      'stats.directorySystemAgent.dsPercentSearchesFromDRA',
      'stats.directorySystemAgent.dsPercentSearchesFromLDAP',
      'stats.directorySystemAgent.dsPercentSearchesFromNTDSAPI',
      'stats.directorySystemAgent.dsPercentSearchesFromSAM',

      'stats.directorySystemAgent.dsPercentWritesFromDRA',
      'stats.directorySystemAgent.dsPercentWritesFromLDAP',
      'stats.directorySystemAgent.dsPercentWritesFromNTDSAPI',
      'stats.directorySystemAgent.dsPercentWritesFromSAM',

      'stats.directorySystemAgent.dsSearchSubOperationsPerSec',
      'stats.directorySystemAgent.dsSecurityDescriptorPropagationsEvents',
      'stats.directorySystemAgent.dsSecurityDescriptorPropagatorAverageExclusionTime',
      'stats.directorySystemAgent.dsSecurityDescriptorPropagatorRuntimeQueue',
      'stats.directorySystemAgent.dsSecurityDescriptorSubOperationsPersec'
    ],
    labels: [
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.clientSessions'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.busyretries'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.connections'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.sslConnections'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.closedConnections'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.active'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.sleepingOnBusy'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.add'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.delete'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modify'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modifyDN'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.add'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.delete'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modify'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modifyDN'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.write'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.search'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.udp'),
      t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.availableBatchSlots'),
      t('in-forge:plugins.activeDirectory.addressBook.abAnrPerSec'),
      t('in-forge:plugins.activeDirectory.addressBook.abBrowsesPerSec'),
      t('in-forge:plugins.activeDirectory.addressBook.abClientSessions'),
      t('in-forge:plugins.activeDirectory.addressBook.abMatchesPerSec'),
      t('in-forge:plugins.activeDirectory.addressBook.abPropertyReadsPerSec'),
      t('in-forge:plugins.activeDirectory.addressBook.abProxyLookupsPerSec'),
      t('in-forge:plugins.activeDirectory.addressBook.abSearchesPerSec'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsClientBindsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsClientNameTranslationsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectoryReadsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectorySearchesPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectoryWritesPerSec'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsClientBindsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsClientNameTranslationsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectoryReadsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectorySearchesPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectoryWritesPerSec'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsMonitorListSize'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsNameCachehitRate'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsNotifyQueueSize'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsOther'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesOther'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesOther'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSearchSubOperationsPerSec'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromDRA'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromNTDSAPI'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromSAM'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromDRA'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromLDAP'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromNTDSAPI'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromSAM'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromDRA'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromLDAP'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromNTDSAPI'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromSAM'),

      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSearchSubOperationsPerSec'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorPropagationsEvents'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorPropagatorAverageExclusionTime'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorPropagatorRuntimeQueue'),
      t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorSubOperationsPersec')
    ],
    formatter: number.compact
  }
];

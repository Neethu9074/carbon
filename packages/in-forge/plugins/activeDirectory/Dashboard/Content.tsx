/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

//@ts-expect-error
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function ActiveDirectoryDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocolLabel')}>
        <Columize>
          <Card
            title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.connections')}
            useMaxAvailableHeight
          >
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: [
                  'stats.lightweightDirectoryAccessProtocol.clientSessions',
                  'stats.lightweightDirectoryAccessProtocol.busyRetries'
                ],
                labels: [
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.clientSessions'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.busyretries')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card
            title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.connectionRates')}
            useMaxAvailableHeight
          >
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: [
                  'stats.lightweightDirectoryAccessProtocol.newConnectionsPerSec',
                  'stats.lightweightDirectoryAccessProtocol.newSSLConnectionsPerSec',
                  'stats.lightweightDirectoryAccessProtocol.closedConnectionsPerSec'
                ],
                labels: [
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.connections'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.sslConnections'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.closedConnections')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
        <Columize>
          <Card
            title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.threads')}
            useMaxAvailableHeight
          >
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: [
                  'stats.lightweightDirectoryAccessProtocol.activeThreads',
                  'stats.lightweightDirectoryAccessProtocol.threadsSleepingOnBusy'
                ],
                labels: [
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.active'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.sleepingOnBusy')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card
            title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.batch')}
            useMaxAvailableHeight
          >
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: ['stats.lightweightDirectoryAccessProtocol.batchSlotsAvailable'],
                labels: [t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.availableBatchSlots')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
        <Columize>
          <Card
            title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.operations')}
            useMaxAvailableHeight
          >
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                metrics: [
                  'stats.lightweightDirectoryAccessProtocol.addOperations',
                  'stats.lightweightDirectoryAccessProtocol.deleteOperations',
                  'stats.lightweightDirectoryAccessProtocol.modifyOperations',
                  'stats.lightweightDirectoryAccessProtocol.modifyDNOperations'
                ],
                labels: [
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.add'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.delete'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modify'),
                  t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modifyDN')
                ],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
        <Columize>
          {
            <Card
              title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.operationRates')}
              useMaxAvailableHeight
            >
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.lightweightDirectoryAccessProtocol.addOperationsPerSec',
                    'stats.lightweightDirectoryAccessProtocol.deleteOperationsPerSec',
                    'stats.lightweightDirectoryAccessProtocol.modifyOperationsPerSec',
                    'stats.lightweightDirectoryAccessProtocol.modifyDNOperationsPerSec',
                    'stats.lightweightDirectoryAccessProtocol.writesPerSec',
                    'stats.lightweightDirectoryAccessProtocol.SearchesPerSec',
                    'stats.lightweightDirectoryAccessProtocol.udpOperationsPerSec'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.add'),
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.delete'),
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modify'),
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.modifyDN'),
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.write'),
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.search'),
                    t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol.udp')
                  ],
                  formatter: number.perSecond.compact,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.activeDirectory.addressBookLabel')}>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.addressBook.abDetails')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.addressBook.abAnrPerSec',
                    'stats.addressBook.abBrowsesPerSec',
                    'stats.addressBook.abClientSessions',
                    'stats.addressBook.abMatchesPerSec',
                    'stats.addressBook.abPropertyReadsPerSec',
                    'stats.addressBook.abProxyLookupsPerSec',
                    'stats.addressBook.abSearchesPerSec'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.addressBook.abAnrPerSec'),
                    t('in-forge:plugins.activeDirectory.addressBook.abBrowsesPerSec'),
                    t('in-forge:plugins.activeDirectory.addressBook.abClientSessions'),
                    t('in-forge:plugins.activeDirectory.addressBook.abMatchesPerSec'),
                    t('in-forge:plugins.activeDirectory.addressBook.abPropertyReadsPerSec'),
                    t('in-forge:plugins.activeDirectory.addressBook.abProxyLookupsPerSec'),
                    t('in-forge:plugins.activeDirectory.addressBook.abSearchesPerSec')
                  ],
                  formatter: number.perSecond.compact,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.activeDirectory.directorySystemAgentLabel')}>
        <Columize>
          {
            <Card
              title={t('in-forge:plugins.activeDirectory.directorySystemAgentClientAndDirectory')}
              useMaxAvailableHeight
            >
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsClientBindsPerSec',
                    'stats.directorySystemAgent.dsClientNameTranslationsPerSec',
                    'stats.directorySystemAgent.dsDirectoryReadsPerSec',
                    'stats.directorySystemAgent.dsDirectorySearchesPerSec',
                    'stats.directorySystemAgent.dsDirectoryWritesPerSec'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsClientBindsPerSec'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsClientNameTranslationsPerSec'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectoryReadsPerSec'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectorySearchesPerSec'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsDirectoryWritesPerSec')
                  ],
                  formatter: number.perSecond.compact,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentMemory')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsMonitorListSize',
                    'stats.directorySystemAgent.dsNameCachehitRate',
                    'stats.directorySystemAgent.dsNotifyQueueSize',
                    'stats.directorySystemAgent.dsSearchSubOperationsPerSec'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsMonitorListSize'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsNameCachehitRate'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsNotifyQueueSize'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSearchSubOperationsPerSec')
                  ],
                  formatter: number.compact,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentRead')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentReadsFromDRA',
                    'stats.directorySystemAgent.dsPercentReadsFromNTDSAPI',
                    'stats.directorySystemAgent.dsPercentReadsFromSAM'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromDRA'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromNTDSAPI'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromSAM')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentRead')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentReadsOther',
                    'stats.directorySystemAgent.dsPercentWritesOther',
                    'stats.directorySystemAgent.dsPercentSearchesOther'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsOther'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesOther'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesOther')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentSearches')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentSearchesFromDRA',
                    'stats.directorySystemAgent.dsPercentSearchesFromLDAP',
                    'stats.directorySystemAgent.dsPercentSearchesFromNTDSAPI',
                    'stats.directorySystemAgent.dsPercentSearchesFromSAM'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromDRA'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromLDAP'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromNTDSAPI'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromSAM')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>

        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentWrite')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentWritesFromDRA',
                    'stats.directorySystemAgent.dsPercentWritesFromLDAP',
                    'stats.directorySystemAgent.dsPercentWritesFromNTDSAPI',
                    'stats.directorySystemAgent.dsPercentWritesFromSAM'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromDRA'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromLDAP'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromNTDSAPI'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromSAM')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentSecurity')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsSecurityDescriptorPropagationsEvents',
                    'stats.directorySystemAgent.dsSecurityDescriptorPropagatorAverageExclusionTime',
                    'stats.directorySystemAgent.dsSecurityDescriptorPropagatorRuntimeQueue',
                    'stats.directorySystemAgent.dsSecurityDescriptorSubOperationsPersec'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorPropagationsEvents'),
                    t(
                      'in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorPropagatorAverageExclusionTime'
                    ),
                    t(
                      'in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorPropagatorRuntimeQueue'
                    ),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsSecurityDescriptorSubOperationsPersec')
                  ],
                  formatter: number.compact,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.activeDirectory.directorySystemAgentKCC')}>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentKCC')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentReadsFromKCC',
                    'stats.directorySystemAgent.dsPercentWritesFromKCC',
                    'stats.directorySystemAgent.dsPercentSearchesFromKCC'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromKCC'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromKCC'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromKCC')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
      </DashboardSection>
      <DashboardSection>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentLSA')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentReadsFromLSA',
                    'stats.directorySystemAgent.dsPercentWritesFromLSA',
                    'stats.directorySystemAgent.dsPercentSearchesFromLSA'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromLSA'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromLSA'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromLSA')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
          {
            <Card title={t('in-forge:plugins.activeDirectory.directorySystemAgentNSPI')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.directorySystemAgent.dsPercentReadsFromNSPI',
                    'stats.directorySystemAgent.dsPercentWritesFromNSPI',
                    'stats.directorySystemAgent.dsPercentSearchesFromNSPI'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentReadsFromNSPI'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentWritesFromNSPI'),
                    t('in-forge:plugins.activeDirectory.directorySystemAgent.dsPercentSearchesFromNSPI')
                  ],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
      </DashboardSection>
      <DashboardSection>
        <Columize>
          {
            <Card title={t('in-forge:plugins.activeDirectory.securityAccountManagerLabel')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  metrics: [
                    'stats.securityAccountManager.samAccountGroupEvaluationLatency',
                    'stats.securityAccountManager.samResourceGroupEvaluationLatency',
                    'stats.securityAccountManager.samDisplayInformationQueriesPerSec',
                    'stats.securityAccountManager.samDomainLocalGroupMembershipEvaluationsPerSec',
                    'stats.securityAccountManager.samMachineCreationAttemptsPerSec',
                    'stats.securityAccountManager.samMembershipChangesPerSec',
                    'stats.securityAccountManager.samNonTransitiveMembershipEvaluationsPerSec',
                    'stats.securityAccountManager.samMachineCreationAttemptsPerSec',
                    'stats.securityAccountManager.samMembershipChangesPerSec',
                    'stats.securityAccountManager.samNonTransitiveMembershipEvaluationsPerSec',
                    'stats.securityAccountManager.samPasswordChangesPerSec',
                    'stats.securityAccountManager.samSuccessfulComputerCreationsPerSec',
                    'stats.securityAccountManager.samSuccessfulUserCreationsPerSec',
                    'stats.securityAccountManager.samTransitiveMembershipEvaluationsPerSec',
                    'stats.securityAccountManager.samUniversalGroupMembershipEvaluationsPerSec',
                    'stats.securityAccountManager.samUserCreationAttemptsPerSec'
                  ],
                  labels: [
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samAccountGroupEvaluationLatency'),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samResourceGroupEvaluationLatency'),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samDisplayInformationQueriesPerSec'),
                    t(
                      'in-forge:plugins.activeDirectory.securityAccountManager.samDomainLocalGroupMembershipEvaluationsPerSec'
                    ),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samEnumerationsPerSec'),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samGCEvaluationsPerSec'),
                    t(
                      'in-forge:plugins.activeDirectory.securityAccountManager.samGlobalGroupMembershipEvaluationsPerSec'
                    ),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samMachineCreationAttemptsPerSec'),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samMembershipChangesPerSec'),
                    t(
                      'in-forge:plugins.activeDirectory.securityAccountManager.samNonTransitiveMembershipEvaluationsPerSec'
                    ),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samPasswordChangesPerSec'),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samSuccessfulComputerCreationsPerSec'),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samSuccessfulUserCreationsPerSec'),
                    t(
                      'in-forge:plugins.activeDirectory.securityAccountManager.samTransitiveMembershipEvaluationsPerSec'
                    ),
                    t(
                      'in-forge:plugins.activeDirectory.securityAccountManager.samUniversalGroupMembershipEvaluationsPerSec'
                    ),
                    t('in-forge:plugins.activeDirectory.securityAccountManager.samUserCreationAttemptsPerSec')
                  ],
                  formatter: number.compact,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          }
        </Columize>
      </DashboardSection>
    </div>
  );
}

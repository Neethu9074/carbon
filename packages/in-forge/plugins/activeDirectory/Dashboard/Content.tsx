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
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
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
      <DashboardSection title={t('in-forge:plugins.activeDirectory.lightweightDirectoryAccessProtocol')}>
        <Columize>
          <Card title={t('in-forge:plugins.activeDirectory.ldap.connections')} useMaxAvailableHeight>
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
                  t('in-forge:plugins.activeDirectory.ldap.clientSessions'),
                  t('in-forge:plugins.activeDirectory.ldap.busyretries')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card title={t('in-forge:plugins.activeDirectory.ldap.connectionRates')} useMaxAvailableHeight>
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
                  t('in-forge:plugins.activeDirectory.ldap.connections'),
                  t('in-forge:plugins.activeDirectory.ldap.sslConnections'),
                  t('in-forge:plugins.activeDirectory.ldap.closedConnections')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
        <Columize>
          <Card title={t('in-forge:plugins.activeDirectory.ldap.threads')} useMaxAvailableHeight>
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
                  t('in-forge:plugins.activeDirectory.ldap.active'),
                  t('in-forge:plugins.activeDirectory.ldap.sleepingOnBusy')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card title={t('in-forge:plugins.activeDirectory.ldap.batch')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: ['stats.lightweightDirectoryAccessProtocol.batchSlotsAvailable'],
                labels: [t('in-forge:plugins.activeDirectory.ldap.availableBatchSlots')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
        <Columize>
          <Card title={t('in-forge:plugins.activeDirectory.ldap.operations')} useMaxAvailableHeight>
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
                  t('in-forge:plugins.activeDirectory.ldap.add'),
                  t('in-forge:plugins.activeDirectory.ldap.delete'),
                  t('in-forge:plugins.activeDirectory.ldap.modify'),
                  t('in-forge:plugins.activeDirectory.ldap.modifyDN')
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
            <Card title={t('in-forge:plugins.activeDirectory.ldap.operationRates')} useMaxAvailableHeight>
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
                    t('in-forge:plugins.activeDirectory.ldap.add'),
                    t('in-forge:plugins.activeDirectory.ldap.delete'),
                    t('in-forge:plugins.activeDirectory.ldap.modify'),
                    t('in-forge:plugins.activeDirectory.ldap.modifyDN'),
                    t('in-forge:plugins.activeDirectory.ldap.write'),
                    t('in-forge:plugins.activeDirectory.ldap.search'),
                    t('in-forge:plugins.activeDirectory.ldap.udp')
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
    </div>
  );
}

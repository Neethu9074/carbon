/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { number, withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import NodeSummary from '../NodeSummary.js';
import { t } from 'in-i18n';

function isAtLeastMinorVersion(version, minorVersion) {
  if (version == undefined || version.startsWith('pre-')) {
    return false;
  }
  const versionArray = version.split('.', 2);
  return versionArray.length > 1 && versionArray[1] >= minorVersion;
}

export default function HazelcastDashboard({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version']);
  const eventQueueCapacity = snapshot.getIn(['data', 'eventQueueCapacity']);
  const hasDistributedObject = isAtLeastMinorVersion(version, 5);
  const hasExecutionQueueSize = isAtLeastMinorVersion(version, 2);
  const hasOperationCount = eventQueueCapacity != null;

  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      {hasOperationCount && (
        <DashboardSection title={t('in-forge:plugins.hazelcastNode.dashboard.operationCount')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixZeroDecimalPlaces,
              metrics: ['nodeMetrics.operationCount'],
              labels: [t('in-forge:plugins.hazelcastNode.dashboard.operationCount')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <Columize>
        <DashboardSection title={t('in-forge:plugins.hazelcastNode.dashboard.migrationQueueSize')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['nodeMetrics.migrationQueueSize'],
              labels: [t('in-forge:plugins.hazelcastNode.dashboard.migrationQueueSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.hazelcastNode.dashboard.eventQueueSize')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: { eventQueueCapacity },
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixZeroDecimalPlaces,
              metrics: ['nodeMetrics.eventQueueSize'],
              labels: [t('in-forge:plugins.hazelcastNode.dashboard.eventQueueSize')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {hasDistributedObject && (
        <DashboardSection title={t('in-forge:plugins.hazelcastNode.dashboard.distributedObjects')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixZeroDecimalPlaces,
              metrics: [
                'distributedObject.cacheCount',
                'distributedObject.mapCount',
                'distributedObject.replicatedMapCount',
                'distributedObject.multiMapCount',
                'distributedObject.queueCount',
                'distributedObject.listCount',
                'distributedObject.setCount',
                'distributedObject.topicCount',
                'distributedObject.executorCount',
                'distributedObject.otherCount'
              ],
              labels: [
                t('in-forge:plugins.hazelcastNode.dashboard.iCache'),
                t('in-forge:plugins.hazelcastNode.dashboard.iMap'),
                t('in-forge:plugins.hazelcastNode.dashboard.replicatedMap'),
                t('in-forge:plugins.hazelcastNode.dashboard.multiMap'),
                t('in-forge:plugins.hazelcastNode.dashboard.iQueue'),
                t('in-forge:plugins.hazelcastNode.dashboard.iList'),
                t('in-forge:plugins.hazelcastNode.dashboard.iSet'),
                t('in-forge:plugins.hazelcastNode.dashboard.iTopic'),
                t('in-forge:plugins.hazelcastNode.dashboard.iExecutorService'),
                t('in-forge:plugins.hazelcastNode.dashboard.other')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {hasExecutionQueueSize && (
        <DashboardSection title={t('in-forge:plugins.hazelcastNode.dashboard.executionServiceQueueSizes')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixZeroDecimalPlaces,
              metrics: [
                'executorServiceQueueSize.asyncExecutor',
                'executorServiceQueueSize.clientExecutor',
                'executorServiceQueueSize.queryExecutor',
                'executorServiceQueueSize.scheduledExecutor',
                'executorServiceQueueSize.systemExecutor',
                'executorServiceQueueSize.ioExecutor'
              ],
              labels: [
                t('in-forge:plugins.hazelcastNode.dashboard.asyncExecutor'),
                t('in-forge:plugins.hazelcastNode.dashboard.clientExecutor'),
                t('in-forge:plugins.hazelcastNode.dashboard.queryExecutor'),
                t('in-forge:plugins.hazelcastNode.dashboard.scheduledExecutor'),
                t('in-forge:plugins.hazelcastNode.dashboard.systemExecutor'),
                t('in-forge:plugins.hazelcastNode.dashboard.ioExecutor')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title={t('in-forge:plugins.hazelcastNode.dashboard.clients')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixZeroDecimalPlaces,
            tooltipFormatter: withSiPrefixZeroDecimalPlaces,
            metrics: ['nodeMetrics.clientEndpointCount'],
            labels: [t('in-forge:plugins.hazelcastNode.dashboard.connectedClients')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

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
        <DashboardSection title="Operation Count">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixZeroDecimalPlaces,
              metrics: ['nodeMetrics.operationCount'],
              labels: ['Operation Count'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <Columize>
        <DashboardSection title="MigrationQueue Size">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: ['nodeMetrics.migrationQueueSize'],
              labels: ['MigrationQueue Size'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="EventQueue Size">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: { eventQueueCapacity },
              formatter: withSiPrefixZeroDecimalPlaces,
              tooltipFormatter: withSiPrefixZeroDecimalPlaces,
              metrics: ['nodeMetrics.eventQueueSize'],
              labels: ['EventQueue Size'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      {hasDistributedObject && (
        <DashboardSection title="Distributed Objects">
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
                'ICache',
                'IMap',
                'ReplicatedMap',
                'MultiMap',
                'IQueue',
                'IList',
                'ISet',
                'ITopic',
                'IExecutorService',
                'Other'
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {hasExecutionQueueSize && (
        <DashboardSection title="ExecutionService Queue Sizes">
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
                'AsyncExecutor',
                'ClientExecutor',
                'QueryExecutor',
                'ScheduledExecutor',
                'SystemExecutor',
                'IOExecutor'
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <DashboardSection title="Clients">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: withSiPrefixZeroDecimalPlaces,
            tooltipFormatter: withSiPrefixZeroDecimalPlaces,
            metrics: ['nodeMetrics.clientEndpointCount'],
            labels: ['Connected Clients'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

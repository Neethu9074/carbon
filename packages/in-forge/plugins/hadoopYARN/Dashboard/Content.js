/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import NodesTable from './NodesTable';
import AppsTable from './AppsTable';

export default function Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Cluster Nodes">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['activeNodes', 'lostNodes', 'unhealthyNodes', 'decommissionedNodes'],
            labels: ['Active Nodes', 'Lost Nodes', 'Unhealthy Nodes', 'Decommissioned Nodes'],
            formatter: zeroDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Apps">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['appsRunning', 'appsPending', 'appsFailed'],
              labels: ['Apps Running', 'Apps Pending', 'Apps Failed'],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Cluster Containers">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['containersRunning'],
              labels: ['Containers Running'],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title="Cluster Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['usedMemory', 'availableMemory', 'reservedMemory'],
              labels: ['Used Memory', 'Available Memory', 'Reserved Memory'],
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Cluster Virtual Cores">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['usedVirtualCores', 'availableVirtualCores', 'reservedVirtualCores'],
              labels: ['Used Virtual Cores', 'Available Virtual Cores', 'Reserved Virtual Cores'],
              formatter: zeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <NodesTable snapshot={snapshot} timeConfig={timeConfig} />
      <AppsTable snapshot={snapshot} />
    </div>
  );
}

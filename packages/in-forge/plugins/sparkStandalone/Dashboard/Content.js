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
import WorkersTable from './WorkersTable';
import DriversTable from './DriversTable';
import AppsTable from './AppsTable';

export default function Dashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <DashboardSection title="Cluster Workers">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'workers.aliveWorkers',
              'workers.deadWorkers',
              'workers.decommissionedWorkers',
              'workers.workersInUnknownState'
            ],
            labels: ['Alive Workers', 'Dead Workers', 'Decommissioned Workers', 'Workers In Unknown State'],
            formatter: zeroDecimalPlaces,
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Cluster Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['workers.memoryInUseTotal', 'workers.memoryTotal'],
              labels: ['Used Memory', 'Total Memory'],
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesTwoDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Cluster Cores">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['workers.coresInUseTotal', 'workers.coresTotal'],
              labels: ['Used Cores', 'Total Cores'],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <WorkersTable snapshot={snapshot} timeConfig={timeConfig} />
      <AppsTable snapshot={snapshot} />
      <DriversTable snapshot={snapshot} />
    </div>
  );
}

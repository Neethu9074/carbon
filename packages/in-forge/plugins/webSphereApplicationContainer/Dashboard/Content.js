/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import DatasourcesTable from './DatasourcesTable';
import WebModulesTable from './WebModulesTable';

export default function WebSphereDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <DashboardSection title="Web Container Thread Pool">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['threadPools.webContainer.activeThreads', 'threadPools.webContainer.poolSize'],
            labels: ['Active Threads', 'Pool Size'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <WebModulesTable snapshot={snapshot} timeConfig={timeConfig} />
      <DatasourcesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

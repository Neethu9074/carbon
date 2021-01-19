/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DataSourcesTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/DataSourcesTable';
import ConnectorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ConnectorsTable';
import ExecutorsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/ExecutorsTable';
import WebAppsTable from 'in-forge/plugins/tomcatApplicationContainer/Dashboard/WebAppsTable';
import { twoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function TomcatDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Number of Sessions">
          <MetricValue snapshotId={snapshot.get('id')} metric="totalSessionCount" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Total session count">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['totalSessionCount'],
            labels: ['Total session count'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <WebAppsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ConnectorsTable snapshot={snapshot} timeConfig={timeConfig} />
      <ExecutorsTable snapshot={snapshot} timeConfig={timeConfig} />
      <DataSourcesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

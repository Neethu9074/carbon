/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import RunningQueries from 'in-forge/plugins/clickHouseDatabase/Dashboard/RunningQueries';
import TablesTable from 'in-forge/plugins/clickHouseDatabase/Dashboard/TablesTable.js';
import MetricsTable from 'in-forge/plugins/clickHouseDatabase/Dashboard/MetricsTable';
import { bytes, withSiPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';

export default function ClickHouseDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }

  return (
    <div>
      <DashboardSection title="Select Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['SelectQuery'],
            labels: ['Select Queries'],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['QueryThread'],
            labels: ['Query Threads'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Insert Queries">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['InsertQuery'],
            labels: ['Insert Queries'],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['InsertedBytes'],
            labels: ['Inserted Bytes'],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Merges">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['Merge'],
            labels: ['Merges'],
            type: 'line'
          }}
          y2={{
            min: 0,
            metrics: ['parts'],
            labels: ['Active Parts'],
            type: 'line',
            formatter: withSiPrefixThreeDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <TablesTable snapshot={snapshot} timeConfig={timeConfig} />
      <MetricsTable snapshot={snapshot} timeConfig={timeConfig} />
      <RunningQueries snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

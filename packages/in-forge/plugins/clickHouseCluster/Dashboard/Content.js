/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ClusterNodesTable from 'in-forge/plugins/clickHouseCluster/Dashboard/ClusterNodesTable';
import ClusterSummary from 'in-forge/plugins/clickHouseCluster/Dashboard/ClusterSummary';
import MetricsTable from 'in-forge/plugins/clickHouseDatabase/Dashboard/MetricsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { bytes } from 'in-services/formatters/number';

export default function ClickHouseClusterDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <ClusterSummary snapshot={snapshot} />
      <DashboardSection title="Throughput">
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['SelectQuery'],
              labels: ['Select Queries'],
              type: 'line'
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['InsertedBytes'],
              labels: ['Inserted Bytes'],
              type: 'line',
              formatter: bytes.detailed
            }}
          />
        </Columize>
      </DashboardSection>
      <ClusterNodesTable clusterSnapshotId={snapshotId} timeConfig={timeConfig} />
      <MetricsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

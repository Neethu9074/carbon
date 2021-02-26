/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
      <DashboardSection title={t('in-forge:plugins.clickhouseCluster.dashboard.titleThroughput')}>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['SelectQuery'],
              labels: [t('in-forge:plugins.clickhouseCluster.dashboard.labelSelectQueries')],
              type: 'line'
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['InsertedBytes'],
              labels: [t('in-forge:plugins.clickhouseCluster.dashboard.labelInsertedBytes')],
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

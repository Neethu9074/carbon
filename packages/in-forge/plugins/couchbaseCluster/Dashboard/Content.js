/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React, { Fragment } from 'react';

import ClusterNodesTable from 'in-forge/plugins/couchbaseCluster/Dashboard/ClusterNodesTable';
import ClusterSummary from 'in-forge/plugins/couchbaseCluster/Dashboard/ClusterSummary';
import { BUCKET_METRICS_PREFIX } from 'in-forge/plugins/couchbaseCluster/constants.js';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import BucketsTable from 'in-forge/plugins/couchbaseNode/Dashboard/BucketsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';

export default function CouchbaseClusterDashboard({ snapshot, timeConfig }) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');

  if (sensorConnectionStatus !== 'OK') {
    return (
      <Fragment>
        <DashboardNotification key="main" type="info">
          Cannot receive data from any of the cluster nodes.
        </DashboardNotification>
        {sensorConnectionStatus.map((status, index) => (
          <DashboardNotification key={index} type="info">
            {status}
          </DashboardNotification>
        ))}
      </Fragment>
    );
  }

  return (
    <div>
      <ClusterSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.couchbaseCluster.dashboard.titleThroughput')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.perSecond.compact,
            metrics: ['cluster.ops', 'cluster.cmd_get', 'cluster.cmd_set'],
            labels: [
              t('in-forge:plugins.couchbaseCluster.dashboard.labelOperationsPerSec'),
              t('in-forge:plugins.couchbaseCluster.dashboard.labelGetsPerSec'),
              t('in-forge:plugins.couchbaseCluster.dashboard.labelSetsPerSec')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ClusterNodesTable clusterSnapshotId={snapshot.get('id')} timeConfig={timeConfig} />

      <BucketsTable snapshot={snapshot} timeConfig={timeConfig} bucketMetricsPrefix={BUCKET_METRICS_PREFIX} />
    </div>
  );
}

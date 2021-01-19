/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  muSecondsToMillisTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
import ClusterDownNodesTable from 'in-forge/plugins/cassandraCluster/Dashboard/ClusterDownNodesTable.js';
import ClusterNodesTable from 'in-forge/plugins/cassandraCluster/Dashboard/ClusterNodesTable.js';
import KeyspacesTable from 'in-forge/plugins/cassandraCluster/Dashboard/KeyspacesTable.js';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import ClusterSummary from 'in-forge/plugins/cassandraCluster/ClusterSummary';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { capitalize } from 'in-services/formatters/string';

export default function CassandraClusterDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />
      <DashboardSection title="Overall Requests">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['clientrequests.read.count'],
            labels: ['Reads'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          y2={{
            min: 0,
            metrics: ['clientrequests.write.count'],
            labels: ['Writes'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {['read', 'write'].map(op => (
        <DashboardSection title={'Client ' + capitalize(op) + ' Request Latencies Average'} key={op}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: muSecondsToMillisTwoDecimalPlaces,
              metrics: [
                'clientrequests.' + op + '.mean',
                'clientrequests.' + op + '.50',
                'clientrequests.' + op + '.95',
                'clientrequests.' + op + '.99'
              ],
              labels: ['Mean', '50th Percentile', '95th Percentile', '99th Percentile'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ))}

      <DashboardSection title="Overall Disk Size">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: bytesZeroDecimalPlaces,
            metrics: ['overallDiskSize'],
            labels: ['Overall Disk Size'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ClusterNodesTable snapshot={snapshot} timeConfig={timeConfig} />
      <ClusterDownNodesTable snapshot={snapshot} />

      <KeyspacesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

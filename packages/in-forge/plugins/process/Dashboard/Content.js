/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces, number, siPrefix } from 'in-services/formatters/number';
import ProcessCompanionMetrics from 'in-sdk/components/dashboard/ProcessCompanionMetrics';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { supportsOpenFiles } from 'in-forge/plugins/host/hostUtils';
import ProcessesList from 'in-forge/plugins/process/ProcessesList';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshot }) => ({ hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot) }),

  function ProcessDashboard({ snapshot, timeConfig, hostSnapshot }) {
    const snapshotId = snapshot.get('id');
    const data = snapshot.get('data');
    return (
      <div>
        <DashboardSection title="CPU Usage">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['cpu.user', 'cpu.sys'],
              labels: ['User', 'System'],
              formatter: percentageZeroDecimalPlaces,
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title="Memory">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesTwoDecimalPlaces,
              metrics: ['mem.virtual', 'mem.resident', 'mem.share'],
              labels: ['Virtual', 'Resident', 'Share'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        {hostSnapshot && supportsOpenFiles(hostSnapshot) && (
          <DashboardSection title="Open Files">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: siPrefix.compact,
                tooltipFormatter: number.compact,
                metrics: ['openFiles.current'],
                labels: ['Current'],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: 1,
                metrics: ['openFiles.used'],
                labels: ['Used'],
                formatter: percentageZeroDecimalPlaces,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {data.get('ctx_switches_enabled') ? (
          <DashboardSection title="Number of context switches">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['ctx_switches.voluntary', 'ctx_switches.nonvoluntary'],
                labels: ['Voluntary', 'Nonvoluntary'],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        ) : null}

        <ProcessCompanionMetrics snapshotId={snapshotId} />
        <ProcessesList snapshotId={snapshotId} />
      </div>
    );
  }
);

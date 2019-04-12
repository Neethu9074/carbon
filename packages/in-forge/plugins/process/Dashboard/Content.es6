import React from 'react';

import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces, number } from 'in-services/formatters/number';
import ProcessCompanionMetrics from 'in-sdk/components/dashboard/ProcessCompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { isWindows, isZos } from 'in-forge/plugins/process/hostUtils';
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
          />
        </DashboardSection>

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
          />
        </DashboardSection>

        {hostSnapshot && !(isWindows(hostSnapshot) || isZos(hostSnapshot)) ? (
          <DashboardSection title="Open Files">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: snapshot.getIn(['data', 'openFiles.max']),
                formatter: number.compact,
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
            />
          </DashboardSection>
        ) : null}

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
            />
          </DashboardSection>
        ) : null}

        <ProcessCompanionMetrics snapshotId={snapshotId} />
      </div>
    );
  }
);

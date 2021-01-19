/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import semver from 'semver';
import React from 'react';

import { msZeroDecimalPlaces, zeroDecimalPlaces, zeroDecimalPlacesPerSecond } from 'in-services/formatters/number';
import ExecutorsStreamingAppTableBeforeV200 from './ExecutorsStreamingAppTableBeforeV200';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import ExecutorsStreamingAppTable from './ExecutorsStreamingAppTable';

export default function StreamingAppContent({ snapshot, timeConfig }) {
  const version = snapshot.getIn(['data', 'version'], '2.0.0');

  return (
    <div>
      <DashboardSection title="Batches">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlacesPerSecond,
            metrics: ['completedBatches'],
            labels: ['Completed Batches per Second'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Scheduling Delay">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['schedulingDelay'],
            labels: ['Scheduling Delay'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Total Delay">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['totalDelay'],
            labels: ['Total Delay'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Processing Time">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: msZeroDecimalPlaces,
            metrics: ['processingTime'],
            labels: ['Processing Time'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {semver.satisfies(version, '>=1.6.0') ? (
        <DashboardSection title="Output Operations">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['completedOutputOperations', 'failedOutputOperations'],
              labels: ['Completed Output Operations', 'Failed Output Operations'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}
      <DashboardSection title="Input Records">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['inputRecords'],
            labels: ['Input Records'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Receivers">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['activeReceivers', 'activeReceivers'],
            labels: ['Active Receivers', 'Inactive Receivers'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      {semver.satisfies(version, '>=2.0.0') ? (
        <ExecutorsStreamingAppTable snapshot={snapshot} timeConfig={timeConfig} />
      ) : (
        <ExecutorsStreamingAppTableBeforeV200 snapshot={snapshot} timeConfig={timeConfig} />
      )}
    </div>
  );
}

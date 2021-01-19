/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  msTwoDecimalPlaces,
  kiloBytesZeroDecimalPlaces,
  kiloBytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';

export default function RubyDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="RSS">
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric="memory.rss_size"
            formatter={kiloBytesZeroDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title="Time Spent in GC">
          <GcTime snapshot={snapshot} timeConfig={timeConfig} />
        </DashboardSection>
      </Columize>
      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: kiloBytesTwoDecimalPlaces,
            metrics: ['memory.rss_size'],
            labels: ['Resident'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Heap Slots">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['gc.heap_live', 'gc.heap_free'],
            labels: ['Live', 'Free'],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title="Threads">
          <ThreadMetrics snapshot={snapshot} timeConfig={timeConfig} />
        </DashboardSection>
      </Columize>
    </div>
  );
}

function GcTime({ snapshot, timeConfig }) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: msTwoDecimalPlaces,
        metrics: ['gc.totalTime'],
        labels: ['#GC Run Duration'],
        type: 'line'
      }}
      y2={{
        min: 0,
        tooltipFormatter: zeroDecimalPlaces,
        formatter: twoDecimalPlaces,
        metrics: ['gc.minorGcs', 'gc.majorGcs'],
        labels: ['#Minor GCs', '#Major GCs'],
        type: 'point'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function ThreadMetrics({ snapshot, timeConfig }) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: zeroDecimalPlaces,
        metrics: ['thread.count'],
        labels: ['#Thread Count'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

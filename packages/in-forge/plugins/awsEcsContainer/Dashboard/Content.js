import React, { Fragment } from 'react';

import HealthchecksTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HealthchecksTable';
import HttpServersTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HttpServersTable';
import HeapSpacesTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HeapSpacesTable';
import CpuProfiler from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler';
import { getRuntimeByKey, isNodeJs } from 'in-forge/plugins/awsEcsContainer/runtimes';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { bytes, time, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import MetricValue from 'in-components/MetricValue';

export default function AwsEcsContainerDashboard({ snapshot, timeConfig }) {
  const runtimeKey = snapshot.getIn(['data', 'runtime']);
  const runtime = getRuntimeByKey(runtimeKey);
  return (
    <Fragment>
      <CommonDashboard runtime={runtime} />
      <RuntimeDashboard snapshot={snapshot} timeConfig={timeConfig} runtime={runtime} />
    </Fragment>
  );
}

function CommonDashboard({ runtime }) {
  return <DashboardSection title="Runtime">{runtime.label}</DashboardSection>;
}

function RuntimeDashboard({ snapshot, timeConfig, runtime }) {
  if (isNodeJs(runtime)) {
    return <NodeJsDashboard snapshot={snapshot} timeConfig={timeConfig} />;
    // } else if (isDotNetCore(runtime)) {
    //   ...
    // } else if (isGoLang(runtime)) {
    //   ...
    // } else if (isJava(runtime)) {
    //   ...
    // } else if (isPython(runtime)) {
    //   ...
  }
  return null;
}

function NodeJsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const gcStatsSupported = snapshot.getIn(['data', 'gc.statsSupported']);
  return (
    <div>
      <KpiSection>
        {gcStatsSupported ? (
          <KpiKeyValue label="GC Pause">
            <MetricValue snapshotId={snapshotId} metric="gc.gcPause" formatter={time} />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label="RSS">
          <MetricValue snapshotId={snapshotId} metric="memory.rss" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label="Heap Used">
          <MetricValue snapshotId={snapshotId} metric="memory.heapUsed" formatter={bytes.detailed} />
        </KpiKeyValue>
        {snapshot.getIn(['data', 'libuv.statsSupported']) ? (
          <KpiKeyValue label="Total time spent in loop per second">
            <MetricValue snapshotId={snapshotId} metric="libuv.sum" formatter={time} />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label="Event loop lag">
          <MetricValue snapshotId={snapshotId} metric="libuv.lag" formatter={time} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Memory Usage">{renderGcMetrics(snapshot, timeConfig)}</DashboardSection>

      <DashboardSection title="GC Activity">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['gc.gcPause'],
            labels: ['GC Pause'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <HeapSpacesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title="Event Loop">{renderEventLoopMetrics(snapshot, timeConfig)}</DashboardSection>

      <DashboardSection title="Handles &amp; Requests">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['activeHandles', 'activeRequests'],
            labels: ['#Handles', '#Requests'],
            type: 'line'
          }}
        />
      </DashboardSection>

      <HealthchecksTable snapshot={snapshot} timeConfig={timeConfig} />

      <CpuProfiler snapshot={snapshot} />

      <HttpServersTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function renderGcMetrics(snapshot, timeConfig) {
  if (snapshot.getIn(['data', 'gc.statsSupported'])) {
    return (
      <Chart
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: bytes.detailed,
          tooltipFormatter: bytes.detailedWithRaw,
          metrics: ['memory.rss', 'memory.heapUsed', 'gc.usedHeapSizeAfterGc'],
          labels: ['RSS', 'Heap Size', 'Heap Size After GC'],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: ['gc.minorGcs', 'gc.majorGcs'],
          labels: ['#Minor GCs', '#Major GCs'],
          type: 'point'
        }}
      />
    );
  }

  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: bytes.detailed,
        tooltipFormatter: bytes.detailedWithRaw,
        metrics: ['memory.rss', 'memory.heapUsed'],
        labels: ['RSS', 'Heap Size'],
        type: 'line'
      }}
    />
  );
}

function renderEventLoopMetrics(snapshot, timeConfig) {
  if (snapshot.getIn(['data', 'libuv.statsSupported'])) {
    return (
      <Chart
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: time,
          metrics: ['libuv.max', 'libuv.sum', 'libuv.lag'],
          labels: ['Longest time spent in a single loop', 'Total time spent in loop', 'Event loop lag'],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: ['libuv.num'],
          labels: ['Loops per second'],
          type: 'line'
        }}
      />
    );
  }

  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: time,
        metrics: ['libuv.lag'],
        labels: ['Event loop lag'],
        type: 'line'
      }}
    />
  );
}

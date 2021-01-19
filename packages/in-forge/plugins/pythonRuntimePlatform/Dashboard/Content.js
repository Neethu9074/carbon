/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytes, number, timeByMillisFourDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';

export default function PythonDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <Columize>
        <DashboardSection title="GC Activity">{renderGcMetrics(snapshot, timeConfig)}</DashboardSection>

        <DashboardSection title="Memory Usage">{renderMemoryMetrics(snapshot, timeConfig)}</DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Threads">{renderThreadsMetrics(snapshot, timeConfig)}</DashboardSection>
        <DashboardSection title="Time Spent">{renderTimeMetrics(snapshot, timeConfig)}</DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Paging">{renderPagingMetrics(snapshot, timeConfig)}</DashboardSection>

        <DashboardSection title="I/O">{renderIoMetrics(snapshot, timeConfig)}</DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title="Events">{renderEventsMetrics(snapshot, timeConfig)}</DashboardSection>

        <DashboardSection title="Context Switching">{renderContextMetrics(snapshot, timeConfig)}</DashboardSection>
      </Columize>
    </div>
  );
}

function renderTimeMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: timeByMillisFourDecimalPlaces,
        metrics: ['metrics.ru_utime', 'metrics.ru_stime'],
        labels: ['In User Mode', 'In System Mode'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderMemoryMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: bytes.detailed,
        metrics: ['metrics.ru_ixrss', 'metrics.ru_idrss', 'metrics.ru_maxrss', 'metrics.ru_isrss'],
        labels: ['Shared Memory', 'Unshared Memory', 'Maximum Resident Set Size', 'Unshared Stack Size'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderGcMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.gc.collect0', 'metrics.gc.threshold0'],
        labels: ['Collect 0', 'Threshold 0'],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.gc.collect1', 'metrics.gc.threshold1', 'metrics.gc.collect2', 'metrics.gc.threshold2'],
        labels: ['Collect 1', 'Threshold 1', 'Collect 2', 'Threshold 2'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderPagingMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_minflt', 'metrics.ru_majflt', 'metrics.ru_nswap'],
        labels: ['Page Faults Not Requiring I/O', 'Page Faults Requiring I/O', 'Swap Outs'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderThreadsMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.alive_threads', 'metrics.dummy_threads', 'metrics.daemon_threads'],
        labels: ['Alive Threads', 'Dummy Threads', 'Daemon Threads'],
        type: 'stackedArea'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderIoMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_inblock', 'metrics.ru_oublock'],
        labels: ['Block Input Operations', 'Block Output Operations'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderEventsMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_msgsnd', 'metrics.ru_msgrcv', 'metrics.ru_nsignals'],
        labels: ['Messages Sent', 'Messages Received', 'Signals Received'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderContextMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_nvcsw', 'metrics.ru_nivcsw'],
        labels: ['Voluntary', 'Involuntary'],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

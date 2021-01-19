/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import StoreTable from 'in-forge/plugins/cockroachDBNode/Dashboard/StoreTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import NodeSummary from '../NodeSummary.js';

export default function CockroachDBDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      <DashboardSection title="SQL Latency vs. Queries">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeByNanoTwoDecimalPlaces,
            metrics: ['sql.exec.latency-p99'],
            labels: ['Latency 99th'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['sql.query.count'],
            labels: ['Queries'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Queries">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['sql.select.count'],
            labels: ['Selects'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: zeroDecimalPlaces,
            metrics: ['sql.update.count', 'sql.insert.count', 'sql.delete.count'],
            labels: ['Updates', 'Inserts', 'Deletes'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="SQL Latency">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: timeByNanoTwoDecimalPlaces,
            metrics: [
              'sql.exec.latency-p50',
              'sql.exec.latency-p75',
              'sql.exec.latency-p90',
              'sql.exec.latency-p99',
              'sql.exec.latency-max'
            ],
            labels: ['50th', '75th', '90th', '99th', 'Max'],
            type: 'integral'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Go Memory">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.go.allocbytes', 'sys.go.totalbytes'],
            labels: ['Allocated', 'Total'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Cgo Memory">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.cgo.allocbytes', 'sys.cgo.totalbytes'],
            labels: ['Allocated', 'Total'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Disk">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.read.bytes', 'sys.host.disk.write.bytes'],
            labels: ['Read bytes', 'Write bytes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.disk.read.count', 'sys.host.disk.write.count'],
            labels: ['Read Ops', 'Write Ops'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Disk IOPS in progress">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.iopsinprogress'],
            labels: ['IOPS'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.net.recv.bytes'],
            labels: ['Received'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.net.send.bytes'],
            labels: ['Sent'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <StoreTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

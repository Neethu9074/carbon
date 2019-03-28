import React from 'react';

import Chart from 'in-components/Chart';
import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import StoreTable from 'in-forge/plugins/cockroachDBNode/Dashboard/StoreTable';

import NodeSummary from '../NodeSummary.es6';

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
            defaultDisabledMetrics: [snapshot.get('id') + '__sql.exec.latency-max'],
            labels: ['50th', '75th', '90th', '99th', 'Max'],
            type: 'integral'
          }}
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
        />
      </DashboardSection>
      <DashboardSection title="Disk read bytes">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.read.bytes'],
            labels: ['Read'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Disk write bytes">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.write.bytes'],
            labels: ['Write'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Disk read Ops">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.read.count'],
            labels: ['Read'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Disk write Ops">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.disk.write.count'],
            labels: ['Write'],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Network received bytes">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.net.recv.bytes'],
            labels: ['Received'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title="Network send bytes">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.net.send.bytes'],
            labels: ['Send'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>

      <StoreTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

import React from 'react';

import Chart from 'in-components/Chart';
import { bytesZeroDecimalPlaces, timeByNanoTwoDecimalPlaces, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';

import NodeSummary from '../NodeSummary.es6';

export default function CockroachDBDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <NodeSummary snapshot={snapshot} />
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
            labels: ['Read ops', 'Write ops'],
            type: 'line',
            formatter: zeroDecimalPlaces
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
      <DashboardSection title="Network">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            metrics: ['sys.host.net.recv.bytes'],
            labels: ['Received bytes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
          y2={{
            metrics: ['sys.host.net.send.bytes'],
            labels: ['Sent bytes'],
            type: 'line',
            formatter: bytesZeroDecimalPlaces
          }}
        />
      </DashboardSection>
    </div>
  );
}

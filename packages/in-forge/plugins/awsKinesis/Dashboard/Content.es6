import React from 'react';
import { number, bytes, millis } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AwsKinesisDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Get Records">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['get_records_records', 'get_records_success'],
            labels: ['Get Records records', 'Get Records success'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Put Records">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['put_records_records', 'put_records_success'],
            labels: ['Put Records records', 'Put Records success'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Get Records Performance">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['get_records_age_ms'],
            labels: ['Get Records age'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['get_records_latency'],
            labels: ['Get Records Latency'],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Get Records Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['get_records_bytes'],
            labels: ['Get Records traffic'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Put Record Performance">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['put_record_latency'],
            labels: ['Put Record Latency'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['put_record_success'],
            labels: ['Put Records success'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Put Record Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['put_record_bytes'],
            labels: ['Put Record traffic'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Incoming Records">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['incoming_records'],
            labels: ['Incoming records'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['incoming_bytes'],
            labels: ['Incoming traffic'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Put Records Performance">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['put_records_latency'],
            labels: ['Put Records Latency'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['put_records_bytes'],
            labels: ['Put Records traffic'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Provisioned Throughput Exceeded">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['read_provisioned_throughput_exceeded', 'write_provisioned_throughput_exceeded'],
            labels: ['Read Provisioned Throughput Exceeded', 'Write Provisioned Throughput Exceeded'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}

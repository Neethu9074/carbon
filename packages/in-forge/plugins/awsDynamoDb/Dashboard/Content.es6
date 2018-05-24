import React from 'react';
import { number, bytes, millis } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AwsDynamoDbDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Returned items">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['returned_item_count', 'returned_records_count'],
            labels: ['Returned Items', 'Returned Records'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['returned_bytes'],
            labels: ['Returned Bytes'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Throttle Events">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['read_throttle_events', 'write_throttle_events'],
            labels: ['Read Throttle Events', 'Write Throttle Events'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Consumed capacity units">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['consumed_read_capacity_units', 'consumed_write_capacity_units'],
            labels: ['Consumed read capacity units', 'Consumed write capacity units'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['throttled_requests', 'cond_check_failed_requests'],
            labels: ['Throttled requests', 'Conditional Check Failed Requests'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['successful_request_latency'],
            labels: ['Successful Request Latency'],
            type: 'line',
            formatter: millis.detailed
          }}
        />
      </DashboardSection>
      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['system_errors', 'user_errors'],
            labels: ['System Errors', 'User Errors'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Time To Live Deleted Item Count">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['time_to_live_deleted_item_count'],
            labels: ['TTL Deleted Items'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}

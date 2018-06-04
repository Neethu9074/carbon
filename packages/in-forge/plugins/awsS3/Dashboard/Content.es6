import React from 'react';
import { number, bytes, millis } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AwsS3Dashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: [
              'all_requests',
              'get_requests',
              'put_requests',
              'delete_requests',
              'head_requests',
              'post_requests',
              'list_requests'
            ],
            labels: ['All', 'Get', 'Put', 'Delete', 'Head', 'Post', 'List'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['bytes_downloaded', 'bytes_uploaded'],
            labels: ['Downloaded', 'Uploaded'],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['4xx_errors', '5xx_errors'],
            labels: ['4xx Errors', '5xx Errors'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
      <DashboardSection title="Latency">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['first_byte_latency', 'total_request_latency'],
            labels: ['First Byte Latency', 'Total Request Latency'],
            type: 'line',
            formatter: millis.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}

import React from 'react';

import { number, bytes, seconds } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AwsSqsDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Messages (Average)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: [
              'num_of_msg_delayed',
              'num_of_msg_not_visible',
              'num_of_msg_visible',
              'num_of_empty_receives',
              'num_of_msg_received',
              'num_of_msg_sent'
            ],
            labels: ['Delayed', 'Not Visible', 'Visible', 'Empty Receives', 'Received', 'Sent'],
            formatter: number.detailed,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Old Messages (Average)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['age_of_oldest_msg'],
            labels: ['Age of oldest message'],
            formatter: seconds.fixedCompact,
            type: 'line'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Sent Messages Size (Average)">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['sent_message_size'],
            labels: ['Sent message size'],
            formatter: bytes.compact,
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}

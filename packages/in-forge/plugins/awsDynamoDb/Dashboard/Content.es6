import React from 'react';
import { number } from 'in-services/formatters/number';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';

export default function AwsDynamoDbDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title="Consumed capacity units">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['consumed_read_capacity_units', 'consumed_write_capacity_units'],
            labels: ['Consumed read capacity units', 'Consumed write capacity units'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}

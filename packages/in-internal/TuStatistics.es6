import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function TuStatistics() {
  return (
    <div>
      <DashboardTile title="Entities (mean)">
        <Chart
          snapshotId={ID_OF_PROCESSING_STATISTICS}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['physicalEntities', 'Logical'],
            labels: ['Physical', 'Logical'],
            type: 'stackedArea',
            aggregation: 'max'
          }}
        />
      </DashboardTile>

      <DashboardTile title="Tracing (sum)">
        <Chart
          snapshotId={ID_OF_PROCESSING_STATISTICS}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: ['traces'],
            labels: ['Traces'],
            type: 'stackedArea',
            aggregation: 'sum'
          }}
          y2={{
            min: 0,
            formatter: number.compact,
            metrics: ['spans'],
            labels: ['Spans'],
            type: 'line',
            aggregation: 'sum'
          }}
        />
      </DashboardTile>
    </div>
  );
}

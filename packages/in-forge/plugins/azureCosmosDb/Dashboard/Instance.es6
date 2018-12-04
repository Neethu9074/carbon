import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';
import Chart from 'in-components/Chart';
import { zeroDecimalPlaces, millis, percentagePlainTwoDecimalPlaces } from 'in-services/formatters/number';

export default function Instance({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>Summary</KpiHeading>

        <KpiKeyValue label="Document Count">
          <MetricValue snapshotId={snapshotId} metric="metrics.instance.dc" formatter={zeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Service Availability">
          <MetricValue
            snapshotId={snapshotId}
            metric="metrics.instance.sa"
            formatter={percentagePlainTwoDecimalPlaces}
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Instance metrics">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.instance.tr'],
            labels: ['Total Requests'],
            type: 'line'
          }}
          y2={{
            formatter: zeroDecimalPlaces,
            metrics: ['metrics.instance.mr'],
            labels: ['Metadata Requests'],
            type: 'line'
          }}
        />

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: millis.detaileds,
            metrics: ['metrics.instance.rl'],
            labels: ['Read Latency'],
            type: 'line'
          }}
          y2={{
            formatter: millis.detailed,
            metrics: ['metrics.instance.wl'],
            labels: ['Write Latency'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}

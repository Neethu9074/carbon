import React from 'react';

import { bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import Chart from 'in-components/Chart';
import { emptyList } from 'in-services/fixedImmutables';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

import DatabaseSizesTable from './DatabaseSizesTable';

export default function MongoDBDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionProblems = snapshot.getIn(['data', 'sensorConnectionProblems'], emptyList);
  if (sensorConnectionProblems.size > 0) {
    return (
      <DashboardNotification type="info">
        {sensorConnectionProblems.map(problem => <div>{problem}</div>)}
      </DashboardNotification>
    );
  }

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Connections">
          <MetricValue
            snapshotId={snapshotId}
            metric="connections"
            formatter={number.compact}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
        <KpiKeyValue label="Database Size">
          <MetricValue
            snapshotId={snapshotId}
            metric="totalDbSize"
            formatter={bytesZeroDecimalPlaces}
            timeWindowAggregation="mean"
          />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Database Activity">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            metrics: ['documents.returned', 'documents.inserted', 'documents.updated', 'documents.deleted'],
            labels: ['Read', 'Inserted', 'Updated', 'Deleted'],
            type: 'bar',
            aggregation: 'sum',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="Clients">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['connections'],
            labels: ['Connections'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DatabaseSizesTable snapshot={snapshot} timeframe={timeframe} />
    </div>
  );
}

import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-components/DashboardNotification';
import MetricValue from 'in-components/MetricValue';

import DatabaseSizesTable from './DatabaseSizesTable';

import { bytesZeroDecimalPlaces, number } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';

export default function MongoDBDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionProblems = snapshot.getIn(['data', 'sensorConnectionProblems'], emptyList);

  if (sensorConnectionProblems.size > 0) {
    return sensorConnectionProblems.map(problem => (
      <DashboardNotification key={problem} type="info">
        {problem}
      </DashboardNotification>
    ));
  }

  return (
    <div>
      <KpiSection>
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
          timeConfig={timeConfig}
          y1={{
            metrics: ['documents.returned', 'documents.inserted', 'documents.updated', 'documents.deleted'],
            labels: ['Read', 'Inserted', 'Updated', 'Deleted'],
            type: 'stackedBar',
            aggregation: 'sum',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DashboardSection title="Clients">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['connections'],
            labels: ['Connections'],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>

      <DatabaseSizesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

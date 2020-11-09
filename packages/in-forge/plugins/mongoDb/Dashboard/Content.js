import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import DatabaseSizesTable from './DatabaseSizesTable';
import MetricValue from 'in-components/MetricValue';

export default function MongoDBDashboard({ snapshot, timeConfig }) {
  const sensorConnectionProblems = snapshot.getIn(['data', 'sensorConnectionProblems'], emptyList);
  if (sensorConnectionProblems.size > 0) {
    return sensorConnectionProblems.map(problem => (
      <DashboardNotification key={problem} type="info">
        {problem}
      </DashboardNotification>
    ));
  }

  const snapshotId = snapshot.get('id');
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
            formatter={bytes.detailed}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['virtual', 'mapped'],
            labels: ['Virtual', 'Mapped'],
            type: 'line',
            formatter: bytes.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DatabaseSizesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

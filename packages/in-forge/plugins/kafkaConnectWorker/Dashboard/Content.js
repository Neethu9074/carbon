import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function KafkaConnectWorkerDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Connector Count">
          <MetricValue snapshotId={snapshotId} metric="connectorCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Connector Startup Failure">
          <MetricValue
            snapshotId={snapshotId}
            metric="connectorStartupFailurePercentage"
            formatter={percentage.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label="Task Startup Failure">
          <MetricValue snapshotId={snapshotId} metric="taskStartupFailurePercentage" formatter={percentage.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title="Worker Rebalance">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['completedRebalancesTotal'],
            labels: ['Completed Rebalances'],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.msZeroDecimalPlaces,
            metrics: ['rebalanceAvgTimeMs'],
            labels: ['Rebalance Average Time'],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.detailed,
            metrics: ['rebalancing'],
            labels: ['Rebalancing'],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            formatter: number.msZeroDecimalPlaces,
            metrics: ['timeSinceLastRebalanceMs'],
            labels: ['Time Since Last Rebalance'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </div>
  );
}

import React from 'react';

import ConnectorsTable from 'in-forge/plugins/kafkaConnectWorker/Dashboard/ConnectorsTable.js';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
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

      <Columize>
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
            formatter: millis,
            metrics: ['rebalanceAvgTimeMs'],
            labels: ['Rebalance Average Time'],
            type: 'line'
          }}
        />
      </Columize>
      <Columize>
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
            formatter: millis,
            metrics: ['timeSinceLastRebalanceMs'],
            labels: ['Time Since Last Rebalance'],
            type: 'line'
          }}
        />
      </Columize>

      <ConnectorsTable workerId={snapshotId} timeConfig={timeConfig} />
    </div>
  );
}
